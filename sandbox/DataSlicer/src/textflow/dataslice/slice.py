
from abc import ABCMeta, abstractmethod
import json
import logging

log = logging.getLogger(__name__)

# Constants - Keynames

CONTACTS = "contacts"
TEXTS = "texts"

CONTACT_NAME = "displayName"
CONTACT_PHONE = "normilizedPhone"

TEXT_PHONE = "address"
TEXT_TYPE = "type"
TEXT_TYPE_INBOX = "INBOX"
TEXT_RX_TIME = "receivedDate"

# Data classes

class Contact(object):
    def __init__(self, name):
        self.name = name
        self.entries = []


class ContactEntry(object):
    def __init__(self, phone, data):
        self.phone = phone
        self.data = data


class Conversation(object):
    def __init__(self, contact_name, contact):
        self.contact_name = contact_name
        self.contact = contact
        self.texts = []


class Message(object):
    def __init__(self, data):
        self.data = data
        self.is_incoming = data.get(TEXT_TYPE, "") == TEXT_TYPE_INBOX
        self.rx_time = int(data[TEXT_RX_TIME])

    def to_json(self):
        # Return just self.data plus is_incoming
        json = self.data.copy()
        json["isIncoming"] = self.is_incoming
        return json


class ConversationView(object):
    """
    Abstract base class for various conversation views
    """
    __metaclass__ = ABCMeta

    def __init__(self, conversation):
        """
        :param Conversation conversation: associated conversation
        """
        self.conversation = conversation

    @abstractmethod
    def to_json(self):
        pass


class ConversationsByTimeslice(ConversationView):
    def __init__(self, conversation, timeslice_ms, by_timeslice):
        super(ConversationsByTimeslice, self).__init__(conversation)
        self.timeslice_ms = timeslice_ms
        self.by_timeslice = by_timeslice

    def to_json(self):
        # Return the contact name (or #), timeslice duration, and messages
        messages_json = {}
        for window_start, messages in self.by_timeslice.iteritems():
            messages_json[window_start] = [m.to_json() for m in messages]

        return {
            'timeslice_ms': self.timeslice_ms,
            'contact': self.conversation.contact_name,
            'messages_by_timeslice': messages_json
        }


def do_slice(json_file, json_file_out_timeslice, timeslice_ms):
    """
    Do everything yo

    :param str json_file: input JSON file (will open read-only)
    :param str json_file_out_timeslice: output JSON file for timeslice view (will open writable)
    :param int timeslice_ms: time-slice duration, in milliseconds
    """

    # Load input JSON
    with open(json_file) as fh:
        data = json.load(fh)

    # Step 1: get dict of phone #'s to contacts
    contacts_by_name, contacts_by_phone = _get_contacts_dict(data)

    # Step 2: get conversations
    conversations = _get_conversations(data, contacts_by_phone)

    # Step 3: get conversation "views" and dump each to JSON

    timeslice_view = _timeslice_conversations(conversations, timeslice_ms)

    log.info("Writing timeslice conversation views to %s", json_file_out_timeslice)
    with open(json_file_out_timeslice, 'w') as fh_out:
        json.dump(_views_to_json(timeslice_view), fh_out, indent=2)


def _get_contacts_dict(data):
    """
    Extract contacts from the input JSON data.

    Each contact entry in the JSON has just 1 number, but display-names are repeated. Entries with the same
    display-name are assumed to refer to the same person.

    :param dict data: JSON data

    :return dict(str, Contact), dict(str, Contact): contacts by name, and by phone, respectively
    """

    log.info("Extracting contacts.")

    # Iterate through contact entries; build a dict of name -> list(Contact)
    by_name = {}
    entry_index = -1
    for entry in data[CONTACTS]:
        entry_index += 1

        # FIXME some contacts lacking normalized names. Normalize ourselves?
        phone = entry.get(CONTACT_PHONE)
        name = entry.get(CONTACT_NAME)

        if not phone or not name:
            # No normalized phone # and/or no display name - issue appropriate message
            if not phone and not name:
                log.warning("Contact at position %d has no %s or %s!", entry_index, CONTACT_NAME, CONTACT_PHONE)
            elif not name:
                log.warning("Contact at position %d has no %s.", entry_index, CONTACT_PHONE)
            else:  # has name but no phone
                log.warning("Contact '%s' has no %s", name, CONTACT_PHONE)

            # Next contact (next iteration): ignore this one
            continue

        # Create or update list of contact-entities for the given display-name
        contact = by_name.get(name)
        if not contact:
            contact = Contact(name)
            by_name[name] = contact

        contact.entries.append(ContactEntry(phone, entry))

    # Go through "contacts" and create a 2nd dictionary that looks up by phone#
    by_phone = {}
    for contact in by_name.itervalues():
        for entry in contact.entries:
            by_phone[entry.phone] = contact

    return by_name, by_phone


def _get_conversations(data, contacts_by_phone):
    """
    Extracts conversations from the input JSON data. Groups by contact-name if possible, or by phone # for "anonymous"
    (i.e. no-contact) texts.

    :param dict data: input JSON data
    :param dict(str, Contact) contacts_by_phone: contacts by phone#, as returned by _get_contacts
    :return dict(str, Conversation): dictionary of name/phone# to Conversation
    """

    log.info("Extracting texts.")

    # Iterate through all texts. Group by contact (or phone# if anonymous)
    conversations = {}
    text_index = -1
    for text in data[TEXTS]:
        text_index += 1

        number = text.get(TEXT_PHONE)
        if not number:
            log.warning("Ignoring Text at position %d (no %s)", text_index, TEXT_PHONE)
            continue

        # Get contact by # (if possible), otherwise just use #
        contact = contacts_by_phone.get(number)
        contact_name = contact.name if contact else number

        # Create or update conversation ("make conversation" hehehe...)
        conversation = conversations.get(contact_name)
        if not conversation:
            conversation = Conversation(contact_name, contact)
            conversations[contact_name] = conversation

        conversation.texts.append(Message(text))

    # Texts are grouped by "direction"
    # Each conversation's texts need to be sorted by received date
    # Sort descending (matches existing ordering
    for conversation in conversations.itervalues():
        conversation.texts.sort(cmp=lambda x,y: cmp(x.rx_time, y.rx_time), reverse=True)

    return conversations


def _timeslice_conversations(conversations, timeslice_ms):
    """
    Creates a time-slice view of conversations.

    :param dict(str, Conversation) conversations: name/# to Conversation, as returned by _get_conversations
    :param int timeslice_ms: timeslice_ms duration, in ms
    :return dict(str, ConversationsByTimeslice): name/# to ConversationsByTimeslice
    """

    log.info("Processing texts by timeslice (window size: %d ms)", timeslice_ms)

    by_timeslice = {}
    for contact_name, conversation in conversations.iteritems():

        # Use a dictionary with keys = start of time-window
        sliced_texts = {}
        for text in conversation.texts:
            window_start = (text.rx_time / timeslice_ms) * timeslice_ms
            sliced_texts.setdefault(window_start, []).append(text)

        by_timeslice[contact_name] = ConversationsByTimeslice(conversation, timeslice_ms, sliced_texts)

    return by_timeslice


def _views_to_json(conversation_views):
    """
    Convert a dict of any type of ConversationView to json

    :param dict(str, ConversationView) conversation_views: dictionary of contact-name to ConversationView
    :return dict: JSON data
    """
    data = {}
    for contact_name, view in conversation_views.iteritems():
        # All subclasses of ConversationView must implement to_json
        view_json = view.to_json()

        # Add in class-name just for fun (and completeness)
        view_json['__class__'] = view.__class__.__name__

        data[contact_name] = view_json

    return data