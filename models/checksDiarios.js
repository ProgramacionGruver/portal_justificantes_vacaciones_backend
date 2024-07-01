import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import Usuarios from './Usuarios.js'

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

Usuarios.hasMany(ChecksDiarios, { foreignKey: 'numero_empleado' })
ChecksDiarios.belongsTo(Usuarios, { foreignKey: 'numero_empleado' })

export default ChecksDiarios