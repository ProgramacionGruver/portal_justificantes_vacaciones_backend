import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
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
},
{
    sequelize,
    modelName: "checksDiarios",
})

Usuarios.hasMany(ChecksDiarios, { foreignKey: 'numero_empleado' })
ChecksDiarios.belongsTo(Usuarios, { foreignKey: 'numero_empleado' })

export default ChecksDiarios