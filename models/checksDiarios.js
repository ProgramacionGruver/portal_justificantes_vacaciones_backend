import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const ChecksDiarios = db.define('checksDiarios', {
    idCheck: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_empleado: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechaRegistro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horaRegistro: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

export default ChecksDiarios