'use strict';
const AdmitCardStructureModel = require("../models/admit-card-structure");
const AdmitCardModel = require("../models/admit-card");
const StudentModel = require('../models/student');
const AdminUsersModel = require('../models/users/admin-user');

let GetSingleStudentAdmitCard = async (req, res, next) => {
    let { schoolId, admissionNo, rollNumber } = req.body;
    let className = req.body.class;

    try {
        let admin = await AdminUsersModel.findOne({ schoolId: schoolId });
        if (!admin) {
            return res.status(404).json({ errorMsg: 'Invalid Request!' });
        }
        let adminId = admin._id;
        let student = await StudentModel.findOne({ adminId: adminId, admissionNo: admissionNo, class: className, rollNumber: rollNumber }, 'adminId session admissionNo name rollNumber class fatherName motherName stream');
        if (!student) {
            return res.status(404).json({ errorMsg: 'Student not found !' });
        }
        let studentId = student._id;
        let stream = student.stream;
        if (stream === "stream") {
            stream = "N/A";
        }
        let admitCard = await AdmitCardModel.findOne({ adminId: adminId, studentId: studentId });
        if (!admitCard) {
            return res.status(404).json({ errorMsg: 'Admit card not found !' });
        }
        let examType = admitCard.examType;
        let admitCardStructure = await AdmitCardStructureModel.findOne({ adminId: adminId, class: className, stream: stream, examType: examType });
        if (!admitCardStructure) {
            return res.status(404).json({ errorMsg: 'This class any admit card not found !' });
        }
        let admitCardPublishStatus = admitCardStructure.admitCardPublishStatus;
        if (admitCardPublishStatus == false) {
            return res.status(404).json({ errorMsg: 'Your exam admit card will be release soon !' });
        }
        return res.status(200).json({ admitCardStructure: admitCardStructure, studentInfo: student, admitCard: admitCard });
    } catch (error) {
        return res.status(500).json({ errorMsg: 'Internal Server Error !' });
    }
}
let GetSingleStudentAdmitCardById = async (req, res, next) => {
    let studentId = req.params.id;
    try {
        let student = await StudentModel.findOne({ _id: studentId }, 'session admissionNo name rollNumber class fatherName motherName stream');
        if (!student) {
            return res.status(404).json({ errorMsg: 'Student not found !' });
        }
        let adminId = student.adminId;
        let admitCard = await AdmitCardModel.findOne({ adminId: adminId, studentId: studentId })
        if (!admitCard) {
            return res.status(404).json({ errorMsg: 'Admit card not found !' });
        }
        let stream = student.stream;
        if (stream === "stream") {
            stream = "N/A";
        }
        let className = admitCard.class;

        let examType = admitCard.examType;
        let admitCardStructure = await AdmitCardStructureModel.findOne({ adminId: adminId, class: className, stream: stream, examType: examType });
        if (!admitCardStructure) {
            return res.status(404).json({ errorMsg: 'This class any admit card not found !' });
        }
        let admitCardPublishStatus = admitCardStructure.admitCardPublishStatus;
        if (admitCardPublishStatus == false) {
            return res.status(404).json({ errorMsg: 'Your exam admit card will be release soon !' });
        }

        return res.status(200).json({ admitCardStructure: admitCardStructure, admitCard: admitCard, student: student });
    } catch (error) {
        return res.status(500).json({ errorMsg: 'Internal Server Error !' });;
    }
}

let GetAllStudentAdmitCardByClass = async (req, res, next) => {
    let adminId = req.params.id;
    let className = req.params.class;
    try {
        const studentInfo = await StudentModel.find({ adminId: adminId, class: className }, '_id adminId session admissionNo name rollNumber class fatherName motherName stream');
        if (!studentInfo) {
            return res.status(404).json({ errorMsg: 'This class any student not found !' });
        }
        const admitCardInfo = await AdmitCardModel.find({ adminId: adminId, class: className });
        if (!admitCardInfo) {
            return res.status(404).json({ errorMsg: 'This class admit card not found !' });
        }
        return res.status(200).json({ admitCardInfo: admitCardInfo, studentInfo: studentInfo });
    } catch (error) {
        return res.status(500).json({ errorMsg: 'Internal Server Error !' });
    }
}

let ChangeStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const admitCard = await AdmitCardModel.findOne({ studentId: id });
        const objectId = admitCard._id;
        const { statusValue } = req.body;
        let status = statusValue == 1 ? 'Active' : 'Inactive'
        const studentData = {
            status: status
        }
        const updateStatus = await AdmitCardModel.findByIdAndUpdate(objectId, { $set: studentData }, { new: true });
        return res.status(200).json('Student update successfully.');
    } catch (error) {
        return res.status(500).json({ errorMsg: 'Internal Server Error !' });;
    }
}

module.exports = {
    GetSingleStudentAdmitCard,
    GetSingleStudentAdmitCardById,
    GetAllStudentAdmitCardByClass,
    ChangeStatus
}