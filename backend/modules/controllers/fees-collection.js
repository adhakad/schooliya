'use strict';
const FeesCollectionModel = require('../models/fees-collection');
const FeesStructureModel = require('../models/fees-structure');
const StudentModel = require('../models/student');
const { DateTime } = require('luxon');

let GetSingleStudentFeesCollectionById = async (req, res, next) => {
    let studentId = req.params.studentId;

    try {
        const student = await StudentModel.find({ _id: studentId }, '_id session admissionNo name rollNumber class fatherName motherName dob');
        if (!student) {
            return res.status(404).json('Student not found !')
        }
        const studentFeesCollection = await FeesCollectionModel.findOne({ studentId: studentId });
        return res.status(200).json({ studentInfo: student, studentFeesCollection: studentFeesCollection });
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}

let GetAllStudentFeesCollectionByClass = async (req, res, next) => {
    let adminId = req.params.id;
    let className = req.params.class;
    try {
        const student = await StudentModel.find({ adminId: adminId, class: className }, '_id session admissionNo name rollNumber class fatherName dob');
        if (!student) {
            return res.status(404).json('Student not found !')
        }
        const studentFeesCollection = await FeesCollectionModel.find({ adminId: adminId, class: className });
        if (!studentFeesCollection) {
            return res.status(404).json('Student fees collection not found !')
        }
        return res.status(200).json({ studentFeesCollection: studentFeesCollection, studentInfo: student });
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}

let CreateFeesCollection = async (req, res, next) => {
    let className = req.body.class;
    let { adminId, studentId, feesAmount, createdBy } = req.body;
    let receiptNo = Math.floor(Math.random() * 899999 + 100000);
    const currentDateIst = DateTime.now().setZone('Asia/Kolkata');
    const istDateTimeString = currentDateIst.toFormat('dd-MM-yyyy hh:mm:ss a');
    try {

        const checkFeesStructure = await FeesStructureModel.findOne({ adminId: adminId, class: className });
        if (!checkFeesStructure) {
            return res.status(404).json(`Class ${className} fees structure not found !`);
        }
        const checkFeesCollection = await FeesCollectionModel.findOne({ adminId: adminId, studentId: studentId, class: className });
        if (!checkFeesCollection) {
            return res.status(404).json(`Fees record not found !`);
        }

        const id = checkFeesCollection._id;
        const totalFees = checkFeesCollection.totalFees;
        const paidFees = checkFeesCollection.paidFees + feesAmount
        const dueFees = totalFees - paidFees;
        if (totalFees == checkFeesCollection.paidFees) {
            return res.status(400).json(`All fees amount already paid !`);
        }
        if (feesAmount > checkFeesCollection.dueFees) {
            return res.status(400).json(`Paying fees amount is greater then due fees amount !`);
        }
        const feesData = {
            receiptNo: receiptNo,
            totalFees: totalFees,
            discountAmountInFees:checkFeesCollection.discountAmountInFees,
            paidFees: paidFees,
            dueFees: dueFees,
            feesAmount: feesAmount,
            paymentDate: istDateTimeString,
            admissionFeesPayable:checkFeesCollection.admissionFeesPayable,
            admissionFees:checkFeesCollection.admissionFees,
            createdBy:createdBy
        }
        const updatedDocument = await FeesCollectionModel.findByIdAndUpdate(id, {
            $push: {
                installment: feesAmount,
                receipt: receiptNo,
                paymentDate: istDateTimeString,
                createdBy: createdBy
            },
            $set: {
                totalFees: totalFees,
                paidFees: paidFees,
                dueFees: dueFees
            }
        }, { new: true });
        if (updatedDocument) {
            return res.status(200).json(feesData);
        }
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}

let CreateAdmissionFeesCollection = async (req, res, next) => {
    let className = req.body.class;
    let { studentId, feesAmount } = req.body;
    let receiptNo = Math.floor(Math.random() * 899999 + 100000);
    const currentDateIst = DateTime.now().setZone('Asia/Kolkata');
    const istDateTimeString = currentDateIst.toFormat('dd-MM-yyyy hh:mm:ss a');
    try {

        const checkFeesStructure = await FeesStructureModel.findOne({ class: className });
        if (!checkFeesStructure) {
            return res.status(404).json(`Class ${className} fees structure not found !`);
        }
        const checkFeesCollection = await FeesCollectionModel.findOne({ studentId: studentId, class: className });
        if (!checkFeesCollection) {
            return res.status(404).json(`Fees record not found !`);
        }

        const id = checkFeesCollection._id;
        const totalFees = checkFeesCollection.totalFees;
        const paidFees = feesAmount;
        const dueFees = totalFees - paidFees
        const admissionFeesData = {
            studentId: studentId,
            class: className,
            admissionFees: feesAmount,
            totalFees: totalFees,
            paidFees: paidFees,
            dueFees: dueFees,
            admissionFeesReceiptNo: receiptNo,
            admissionFeesPaymentDate: istDateTimeString
        }
        // const updatedDocument = await FeesCollectionModel.findOneAndUpdate({_id:id}, { $set: admissionFeesData }, { new: true });
        // if (updatedDocument) {
        //     return res.status(200).json(admissionFeesData);
        // }
    } catch (error) {
        return res.status(500).json('Internal Server Error !');
    }
}

module.exports = {
    GetAllStudentFeesCollectionByClass,
    GetSingleStudentFeesCollectionById,
    CreateFeesCollection,
    CreateAdmissionFeesCollection

}