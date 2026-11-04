from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"error": "El usuario ya existe"}), 400

    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario creado con éxito"}), 201

@api.route('/token', methods=['POST'])
def create_token():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"error": "Correo o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "token": access_token,
        "user_id": user.id
    }), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        "logged_in_as": user.email,
        "message": "Acceso concedido"
    }), 200