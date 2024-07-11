import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const CatalogoVacaciones = db.define('catalogo_vacaciones', {
    idVacaciones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    aniosLaborados: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sabadoLaborado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    semanas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    diasAsignados: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "catalogo_vacaciones",
    freezeTableName: true
})

export default CatalogoVacaciones