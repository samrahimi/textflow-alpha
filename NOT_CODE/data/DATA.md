Each ruleset should correspond to a different *approach* and 
may require different inputs and outputs. For example, a 
ruleset looking at rate of change over time is different 
than one that analyzes a new message

Experiments can be performed with plugins:

- Preprocessors clean up the incoming data and select which 
engine will be used (based on things like message length)

- Postprocessors can be used to experiment with hi / lo pass 
filters and to test hypotheses regarding combinations of 
primitives.