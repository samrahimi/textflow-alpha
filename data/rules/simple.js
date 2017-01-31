module.exports = {
    _id: "0a0ff800-4a67-49f9-a5d8-687d97a8f690",
    context_name: 'emotional_intelligence',
    title:'General Purpose EI Bot',
    description:'Flags emotions over a certain threshold, and looks for personality types at either extreme (e.g. introverted or extroverted). Will also run rules like contempt if u want it to',
	thresholds: {
		app_default: {
			high: 0.6,
			low: 0.4
		},
		alerts: {
			high:0.7,
			low:0.3
		},
		app1: {},
		app2: {}
	},
    mappings: {
        anger:{group:0, display_name:null,category:"primary_emotion"},
        joy:{group:0, display_name:null,category:"primary_emotion"},
        sadness:{group:0, display_name:null,category:"primary_emotion"},
        fear:{group:0, display_name:null,category:"primary_emotion"},
        disgust:{group:0, display_name:null, category:"primary_emotion"},
        extraversion: {group:1, display_name:"outgoing", opposite:"shy", category:"personality"},
        agreeableness: {group:1, display_name:"cooperative", opposite: "stubborn", category:"personality"},
        openness: {group:1, display_name:"open", opposite: "closed", category:"personality"},
        conscientiousness: {group:1, display_name:"detail oriented", opposite:"careless", category:"personality"},
        tentative: {group:1, display_name:"lacking in self-cofidence", category:"emotional_health"},
        confident: {group:1, display_name:"confident", category:"emotional_health"},
        emotional_range: {group:1, display_name:"sensitive", opposite:"resilient", category: "emotional_health"},
        analytical: {group:1, display_name:"analytical", category: "practical"},
        contempt: {group:2, display_name:"contemptuous", category:"relationships"},
        stonewalling: {group:2, display_name: "stonewalling", opposite: "open-hearted", category:"relationships"}
    },
    display: [
        {title: "Your emotions", svg: "emotions.svg.txt"},
        {title: "How others see you", svg: "perception.svg.txt"},
        {title: "Relationship issues", svg: "emotions.svg.txt"},
    ]
}