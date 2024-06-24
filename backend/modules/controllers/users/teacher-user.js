'use strict';
const bcrypt = require('bcrypt');
const tokenService = require('../../services/teacher-token');
const TeacherUserModel = require('../../models/users/teacher-user');
const TeacherModel = require('../../models/teacher');

let SignupTeacher = async (req, res, next) => {
    const { email, password, teacherUserId, otp } = req.body;
    try {
        const checkUser = await TeacherUserModel.findOne({ email: email });
        if (checkUser) {
            return res.status(400).json("Username already exist !");
        }
        const teacher = await TeacherModel.findOne({ teacherUserId: teacherUserId });
        if (!teacher) {
            return res.status(404).json("Teacher not exist in this institute !")
        }
        const teacherId = teacher._id;
        const checkTeacherId = await TeacherUserModel.findOne({ teacherId: teacherId });
        if (checkTeacherId) {
            return res.status(400).json("User id is invalid !")
        }
        const checkOtp = await teacher.otp;
        if (otp !== checkOtp) {
            return res.status(400).json("Your otp is invalid !");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let teacherData = {
            teacherId: teacherId,
            email: email,
            password: hashedPassword
        }
        const createSignupTeacher = await TeacherUserModel.create(teacherData);
        if(createSignupTeacher){
            return res.status(200).json('Teacher register successfully.');
        }
    } catch (error) {
        return res.status(500).json({ errorMsg: 'Internal Server Error !' });;
    }
}

let LoginTeacher = async (req, res, next) => {
    try {
        let teacher = await TeacherUserModel.findOne({ email: req.body.email})
        if (!teacher) {
            return res.status(404).json({ errorMsg: 'Username or password invalid !' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, teacher.password);
        if (!passwordMatch) {
            return res.status(404).json({ errorMsg: 'Username or password invalid !' });
        }
        let teacherId = await teacher.teacherId;
        let teacherInfo = await TeacherModel.findOne({ _id: teacherId });
        if (teacherInfo.status == "Inactive") {
            return res.status(400).json({ errorMsg: 'Login permission blocked, please contact school administration !' })
        }
        if (teacherInfo.status == "Active") {
            const payload = { id: teacher._id, email: teacher.email, name: teacherInfo.name };
            const accessToken = await tokenService.getAccessToken(payload);
            const refreshToken = await tokenService.getRefreshToken(payload);
            if(accessToken && refreshToken){
                return res.status(200).json({ teacherInfo: teacherInfo, accessToken, refreshToken });
            }
        }
        return res.status(400).json({ errorMsg: 'Login error !' });
    } catch (error) {
        return res.status(500).json({ errorMsg: 'Internal Server Error !' });
    }
}

let RefreshToken = async (req, res, next) => {
    try {
        const { token } = req.body
        if (token) {
            const payload = await tokenService.verifyRefreshToken(token)
            const accessToken = await tokenService.getAccessToken(payload)
            res.send({ accessToken })
        }
        else {
            res.status(403).send('token Unavailable!!')
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    SignupTeacher,
    LoginTeacher,
    RefreshToken
}