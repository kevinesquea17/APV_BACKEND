import nodemailer from 'nodemailer';

const emailRegistro = (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;

    //Enviar Mail

    const info = transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola ${nombre}, comprueba tu cuenta en APV</p>
                <p>Tu cuenta ya está lista, solo debes solo debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}" >Comprobar cuenta</a></p>

                <p>Si tu no creaste está cuenta, haz caso omiso</p>        
        `

    })

}


export default emailRegistro;