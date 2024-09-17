import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const DiasFeriados = db.define('dias_feriados', {
    idDiaFeriado: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    editedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        sequelize,
        modelName: "dias_feriados",
    })

export default DiasFeriados