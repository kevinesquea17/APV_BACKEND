import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteGuardado = await paciente.save();
        res.status(200).json(pacienteGuardado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.status(200).json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({msg: "No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json("Accion no valida");
    }

    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({msg: "No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json("Accion no valida");
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email  || paciente.email ;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.status(200).json(pacienteActualizado);
    } catch (error) {
        res.status(500).json(error);
    }
    
}

const eliminarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({msg: "No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json("Accion no valida");
    }

    try {
        await paciente.deleteOne();
        res.status(200).json({msg: "Eliminado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente
};