import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const JustificantesMasivos = db.define('justificantes_masivos', {
    idJustificantesMasivos: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    folioJustificanteMasivo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    claveEmpresa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    claveSucursal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    claveDepartamento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descripcionMotivo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    editedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        sequelize,
        modelName: "justificantes_masivos",
    })

export default JustificantesMasivos