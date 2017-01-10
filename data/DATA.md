Until we have a DB we are storing context & client-specific data here, in JSON files. 
Try and keep it modular and centralize the retrieval of this data - that way there's only 
1 piece to change when a noSQL DB is introduced at a later date.