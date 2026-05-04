const roomService = require('../services/room.service');

async function getAdminRooms(req, res) {
  const result = await roomService.listRoomsForAdmin(req.query);
  res.status(200).json({ success: true, ...result });
}

async function getAdminRoomById(req, res) {
  const room = await roomService.getRoomForAdmin(req.params.id);
  res.status(200).json({ success: true, room });
}

async function deleteAdminRoom(req, res) {
  const room = await roomService.adminSoftDeleteRoom(req.params.id, req.correlationId);
  res.status(200).json({ success: true, room });
}

module.exports = {
  getAdminRooms,
  getAdminRoomById,
  deleteAdminRoom,
};
