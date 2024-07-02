import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:user_mngmnt_app/models/room.dart';
import 'package:user_mngmnt_app/services/room_service.dart';

class CustomDropdown extends StatefulWidget {
  final Function handleRoomChange;
  const CustomDropdown({super.key, required this.handleRoomChange});

  @override
  State<CustomDropdown> createState() => _CustomDropdownState();
}

class _CustomDropdownState extends State<CustomDropdown> {
  RoomService roomService = GetIt.I<RoomService>();
  List<Room> rooms = [];
  Room? selectedRoom;

  @override
  void initState() {
    super.initState();
    fetchRooms();
  }

  fetchRooms() async {
    final data = await roomService.findAllRooms();
    setState(() {
      rooms = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 250,
      child: ListView.builder(
        itemCount: rooms.length,
        itemBuilder: (context, index) {
          final room = rooms[index];
          return GestureDetector(
            onTap: () {
              widget.handleRoomChange(room);
              setState(() {
                selectedRoom = room;
              });
            },
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: selectedRoom == room ? Colors.blue : Colors.black12,
                // borderRadius: BorderRadius.circular(5),
              ),
              child: Padding(
                padding: const EdgeInsets.only(left: 30.0),
                child: Text(
                  room.label,
                  style: const TextStyle(color: Colors.white, fontSize: 20),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
