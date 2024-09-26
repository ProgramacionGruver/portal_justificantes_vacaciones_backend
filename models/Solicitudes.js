import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import CatalogoTipoSolicitudes from './CatalogoTipoSolicitudes.js'
import Usuarios from './Usuarios.js'
import Empresas from './Empresas.js'
import Sucursales from './Sucursales.js'
import Departamentos from './Departamentos.js'
import CatalogoMotivos from './CatalogoMotivos.js'
import JustificantesMasivos from './JustificantesMasivos.js'

const Solicitudes = db.define('solicitudes', {
    idSolicitud: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    folio: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    idTipoSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numero_empleado: {
        type: DataTypes.INTEGER,
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
    idMotivo: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    descripcionMotivo: {
        type: DataTypes.STRING(350),
        allowNull: true,
    },
    folioJustificanteMasivo: {
        type: DataTypes.STRING,
        allowNull: true
    },
},
    {
        sequelize,
        modelName: "solicitudes",
    })

CatalogoTipoSolicitudes.hasMany(Solicitudes, { foreignKey: 'idTipoSolicitud' })
Solicitudes.belongsTo(CatalogoTipoSolicitudes, { foreignKey: 'idTipoSolicitud' })

Usuarios.hasMany(Solicitudes, { foreignKey: 'numero_empleado', sourceKey: 'numero_empleado' })
Solicitudes.belongsTo(Usuarios, { foreignKey: 'numero_empleado', targetKey: 'numero_empleado'})

Empresas.hasMany(Solicitudes, { foreignKey: 'claveEmpresa', sourceKey: 'claveEmpresa' })
Solicitudes.belongsTo(Empresas, { foreignKey: 'claveEmpresa', targetKey: 'claveEmpresa' })

Sucursales.hasMany(Solicitudes, { foreignKey: 'claveSucursal', sourceKey: 'claveSucursal' })
Solicitudes.belongsTo(Sucursales, { foreignKey: 'claveSucursal', targetKey: 'claveSucursal' })

Departamentos.hasMany(Solicitudes, { foreignKey: 'claveDepartamento', sourceKey: 'claveDepartamento' })
Solicitudes.belongsTo(Departamentos, { foreignKey: 'claveDepartamento', targetKey: 'claveDepartamento' })

CatalogoMotivos.hasMany(Solicitudes, { foreignKey: 'idMotivo' })
Solicitudes.belongsTo(CatalogoMotivos, { foreignKey: 'idMotivo' })

JustificantesMasivos.hasMany(Solicitudes, { foreignKey: 'folioJustificanteMasivo', sourceKey: 'folioJustificanteMasivo' });
Solicitudes.belongsTo(JustificantesMasivos, { foreignKey: 'folioJustificanteMasivo', targetKey: 'folioJustificanteMasivo' });

export default Solicitudes