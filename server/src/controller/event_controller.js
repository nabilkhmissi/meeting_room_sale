const { EventModel } = require("../models")
const { ObjectId } = require("mongodb");

module.exports.findAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find({}).populate("room");
    if (events.length > 0) {
        const clean_events = events.map(event => ({
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            applicant: event.applicant
        }))
        return res.status(200).send({ message: "Events retrieved successfully", data: clean_events });
    }
    return res.status(200).send({ message: "Events retrieved successfully", data: events });
  } catch (error) {
    return res.status(500).send({ message : error })
  }
};
module.exports.addEvent = async (req, res) => {
  try {
    let new_event_data
    console.log("=============== ADD EVENT ===============")
    const eventExist = await EventModel.find({
        start: { $gte: req.body.start },
        end: { $lte: req.body.end },
        room: req.body.room,
        applicant : req.body.applicant
    });
    if (eventExist.length > 0) {
        return res.status(500).json("Dates already reserved");
    } else {
            new_event_data = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            room: req.body.room,
            applicant: req.body.applicant,
        };
    }
    const new_event = await EventModel.create(new_event_data);
    return res.status(200).send({ message: "event added successfully", data: new_event });
  } catch (error) {
    return res.status(500).send({ message : error })
  }
};
module.exports.findEventsByRoomID = async (req, res) => {
  try {
    console.log("=============== FIND EVENTS BY ROOM ID ===============")
    const roomId = req.params.id;
    const events = await EventModel.find({ room: roomId });
    return res.status(200).send({ message: "Events retrieved successfully", data: events });
  } catch (error) {
    return res.status(500).send({ message : error })
  }
};
module.exports.getEventById = async function(req,res){
    console.log("=============== FIND EVENT BY ID ===============")
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
      return res.status(404).json({ message: "Event not found " })
    }
    try {
      const event = await EventModel.findOne({_id: ID,
      }).populate({ path: "room" })
      if (event) {
        res.status(200).json({ message: "Event retrieved successfully", data: event });
      }
    }
    catch (error) {
      return res.status(500).send({ message : error })
    }
};
module.exports.deleteEvent = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
      return res.status(404).json("ID is not valid");
    }
    try {
      const event = await EventModel.findByIdAndDelete({ _id: ID });
      res.status(200).json({ message: "Event deleted successfully", data: event });
    } catch (error) {
      return res.status(500).send({ message : error })
    }
};
module.exports.updateEvent = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
      return res.status(404).json("ID is not valid");
    }
    try {
       await EventModel.findByIdAndUpdate(ID, {
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          applicant : req.body.applicant
        });
        const updatedEvent = await EventModel.findById(ID)
        if (updatedEvent) 
            return res.status(200).json({ message: "Event deleted successfully", data: updatedEvent });
    } catch (error) {
      return res.status(500).send({ message : error })
    }
  };

