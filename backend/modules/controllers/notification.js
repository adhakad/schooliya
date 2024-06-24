'use strict';
const NotificationModel = require('../models/notification');

let countNotification = async(req,res,next) => {
    let countNotification = await NotificationModel.count();
    return res.status(200).json({countNotification});
}
let GetNotificationPagination = async (req, res, next) => {
    let searchText = req.body.filters.searchText;
    let searchObj = {};
    if (searchText) {
        searchObj = /^(?:\d*\.\d{1,2}|\d+)$/.test(searchText)
            ? {
                $or: [{ discount: searchText }, { price: searchText }],
            }
            : { title: new RegExp(`${searchText.toString().trim()}`, 'i') };
    }

    try {
        let limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
        let page = req.body.page || 1;
        const notificationList = await NotificationModel.find(searchObj).sort({ _id: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const countNotification = await NotificationModel.count();

        let notificationData = { countNotification: 0 };
        notificationData.notificationList = notificationList;
        notificationData.countNotification = countNotification;
        return res.json(notificationData);
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}

let GetAllNotification = async (req, res, next) => {
    try {
        const notificationList = await NotificationModel.find({ class: req.params.id }).sort({ _id: -1 });
        return res.status(200).json(notificationList);
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}
let GetSingleNotification = async (req, res, next) => {
    try {
        const singleNotification = await NotificationModel.findOne({ _id: req.params.id });
        return res.status(200).json(singleNotification);
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}
let CreateNotification = async (req, res, next) => {
    let date = new Date().getTime();
    const { title, message, role } = req.body;
    var cls = req.body.class;
    if(cls==null || role == "Teacher"){
        cls=101;
    }
    if(cls==null || role == "Public"){
        cls=102;
    }
    const notificationData = {
        title: title,
        message: message,
        role: role,
        class: cls,
        date: date,
    }
    try {
        countNotification = await NotificationModel.find({role:role, class: cls}).count();
        if (countNotification == 10) {
            return res.status(400).json("Notification limit is over to 10 !")
        }
        const createNotification = await NotificationModel.create(notificationData);
        return res.status(200).json('Notification created successfully.');
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}
let UpdateNotification = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, message, role } = req.body;
        const notificationData = {
            title: title,
            message: message,
            role: role,
            class: req.body.class,
            date: Date.now(),
        }
        const updateNotification = await NotificationModel.findByIdAndUpdate(id, { $set: notificationData }, { new: true });
        return res.status(200).json('Notification update successfully.');
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}
let DeleteNotification = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteNotification = await NotificationModel.findByIdAndRemove(id);
        return res.status(200).json('Notification delete successfully.');
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}
module.exports = {
    countNotification,
    GetNotificationPagination,
    GetAllNotification,
    GetSingleNotification,
    CreateNotification,
    UpdateNotification,
    DeleteNotification,
}