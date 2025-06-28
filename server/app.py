#!/usr/bin/env python3

# Standard library imports
import os
from datetime import datetime

# Remote library imports
from flask import request
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Local imports
from config import app, db
from models import Department, Enrollment, Instructor, Student, Unit, User

db.init_app(app)
# Enable CORS
CORS(app)

# Setup API
api = Api(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
jwt = JWTManager(app)


@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


# ==========================
# 🚀 AUTH Routes
# ==========================
class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        role = data.get("role", "user")

        if not username or not password:
            return {"error": "Username and password required"}, 400

        if User.query.filter_by(username=username).first():
            return {"error": "Username already exists"}, 409

        new_user = User(username=username, role=role)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(), 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid username or password"}, 401

        access_token = create_access_token(identity=str(user.id))


        return {
            "access_token": access_token,
            "user": user.to_dict()
        }, 200


# ==========================
# 🚀 Students API
# ==========================
class StudentsResource(Resource):
    @jwt_required()
    def get(self):
        students = Student.query.all()
        return [student.to_dict() for student in students]
    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data.get("name") or not data.get("age"):
            return {"error": "Missing required fields"}, 400

        new_student = Student(name=data["name"], age=data["age"])
        db.session.add(new_student)
        db.session.commit()
        return new_student.to_dict(), 201


class StudentByIDResource(Resource):
    @jwt_required()
    def get(self, student_id):
        student = Student.query.get(student_id)
        if not student:
            return {"error": "Student not found"}, 404
        return student.to_dict()
    @jwt_required()
    def patch(self, student_id):
        student = Student.query.get(student_id)
        if not student:
            return {"error": "Student not found"}, 404

        data = request.get_json()
        student.name = data.get("name", student.name)
        student.age = data.get("age", student.age)
        db.session.commit()
        return student.to_dict()

    @jwt_required()
    def delete(self, student_id):
        student = Student.query.get(student_id)
        if not student:
            return {"error": "Student not found"}, 404

        db.session.delete(student)
        db.session.commit()
        return {"message": "Student deleted successfully"}, 200


# ==========================
# 🚀 Enrollments API
# ==========================
class EnrollmentsResource(Resource):
    @jwt_required()
    def get(self):
        enrollments = Enrollment.query.all()
        return [enrollment.to_dict() for enrollment in enrollments]

    @jwt_required()
    def post(self):
        data = request.get_json()
        student = Student.query.get(data.get("student_id"))
        unit = Unit.query.get(data.get("unit_id"))

        if not student or not unit:
            return {"error": "Invalid student or unit ID"}, 400

        new_enrollment = Enrollment(
            student_id=student.id,
            unit_id=unit.id,
            enrollment_date=datetime.strptime(data.get("enrollment_date"), "%Y-%m-%d"),
            grades=data.get("grades", None)
        )
        db.session.add(new_enrollment)
        db.session.commit()
        return new_enrollment.to_dict(), 201


class EnrollmentByIDResource(Resource):
    @jwt_required()
    def get(self, enrollment_id):
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            return {"error": "Enrollment not found"}, 404
        return enrollment.to_dict()

    @jwt_required()
    def patch(self, enrollment_id):
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            return {"error": "Enrollment not found"}, 404

        data = request.get_json()
        enrollment.grades = data.get("grades", enrollment.grades)
        db.session.commit()
        return enrollment.to_dict()

    @jwt_required()
    def delete(self, enrollment_id):
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            return {"error": "Enrollment not found"}, 404

        db.session.delete(enrollment)
        db.session.commit()
        return {"message": "Enrollment deleted successfully"}, 200


# ==========================
# 🚀 Units API
# ==========================
class UnitsResource(Resource):
    @jwt_required()
    def get(self):
        units = Unit.query.all()
        return [unit.to_dict() for unit in units]


# ==========================
# 🚀 Instructors API
# ==========================
class InstructorsResource(Resource):
    @jwt_required()
    def get(self):
        instructors = Instructor.query.all()
        return [instructor.to_dict() for instructor in instructors]


# ==========================
# 🚀 Departments API
# ==========================
class DepartmentsResource(Resource):
    @jwt_required()
    def get(self):
        departments = Department.query.all()
        return [department.to_dict() for department in departments]


# ==========================
# 🚀 Registering Routes
# ==========================
api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(StudentsResource, "/students")
api.add_resource(StudentByIDResource, "/students/<int:student_id>")
api.add_resource(EnrollmentsResource, "/enrollments")
api.add_resource(EnrollmentByIDResource, "/enrollments/<int:enrollment_id>")
api.add_resource(UnitsResource, "/units")
api.add_resource(InstructorsResource, "/instructors")
api.add_resource(DepartmentsResource, "/departments")


# ==========================
# 🚀 Home Route
# ==========================


@app.route("/")

def index():
    return "<h1>Student Enrollment System with JWT Auth</h1>"


# ==========================
# 🚀 Run App
# ==========================
if __name__ == "__main__":
    app.run(port=5555, debug=True)
