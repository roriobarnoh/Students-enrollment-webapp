from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from config import db, bcrypt

### USER MODEL ###
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="user")  # roles: admin, instructor, user
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    serialize_rules = ("-password_hash",)

    @validates("username")
    def validate_username(self, key, username):
        if not username or len(username.strip()) < 3:
            raise ValueError("Username must be at least 3 characters.")
        return username.strip()

    @property
    def password_hash(self):
        raise AttributeError("Password is write-only.")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    
    def set_password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User {self.username} - {self.role}>"

# ========================
# Existing Models Below
# ========================

### DEPARTMENT MODEL ###
class Department(db.Model, SerializerMixin):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    instructors = db.relationship("Instructor", back_populates="department", cascade="all, delete-orphan")

    serialize_rules = ("-instructors.department",)

    def __repr__(self):
        return f"<Department {self.name}>"

### INSTRUCTOR MODEL ###
class Instructor(db.Model, SerializerMixin):
    __tablename__ = 'instructors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    department_id = db.Column(db.Integer, db.ForeignKey("departments.id"), nullable=False)
    department = db.relationship("Department", back_populates="instructors")

    units = db.relationship("Unit", back_populates="instructor", cascade="all, delete-orphan")

    serialize_rules = ("-units.instructor", "-department.instructors")

    def __repr__(self):
        return f"<Instructor {self.name} - {self.email}>"

### UNIT MODEL ###
class Unit(db.Model, SerializerMixin):
    __tablename__ = 'units'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    instructor_id = db.Column(db.Integer, db.ForeignKey("instructors.id"), nullable=False)
    instructor = db.relationship("Instructor", back_populates="units")

    enrollments = db.relationship("Enrollment", back_populates="unit", cascade="all, delete-orphan")
    students = association_proxy("enrollments", "student")

    serialize_rules = ("-instructor.units", "-enrollments.unit")

    def __repr__(self):
        return f"<Unit {self.title}>"

### STUDENT MODEL ###
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    enrollments = db.relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    units = association_proxy("enrollments", "unit")

    serialize_rules = ("-enrollments.student",)

    def __repr__(self):
        return f"<Student {self.name}, Age {self.age}>"

### ENROLLMENT MODEL ###
class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey("units.id"), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)
    grades = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    student = db.relationship("Student", back_populates="enrollments")
    unit = db.relationship("Unit", back_populates="enrollments")

    serialize_rules = ("-student.enrollments", "-unit.enrollments")

    def __repr__(self):
        return f"<Enrollment Student {self.student_id} -> Unit {self.unit_id}>"
