import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import Usuarios from './Usuarios.js'

const Incapacidades = db.define('incapacidades', {
    idIncapacidades: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: false,
    },
    fechaIncapacidad: {
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
    urlDocumento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    folio: {
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
        modelName: "incapacidades",
    })


Usuarios.hasMany(Incapacidades, { foreignKey: 'numero_empleado', sourceKey: 'numero_empleado' })
Incapacidades.belongsTo(Usuarios, { foreignKey: 'numero_empleado', targetKey: 'numero_empleado'})

export default Incapacidades