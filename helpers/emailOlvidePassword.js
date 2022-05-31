import nodemailer from 'nodemailer';

const emailOlvidePassword = (datos) => {
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
        subject: 'Reestablece tu password en APV',
        text: "Reestablce tu cuenta en APV",
        html: `<p>Hola ${nombre}, has solicita reestablecer tu password</p>
                <p>solo debes solo debes comprobarla en el siguiente enlace para modificarlo:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Reestablecer Password</a></p>

                <p>Si tu no hiciste está solicitud, haz caso omiso</p>        
        `

    })

}


export default emailOlvidePassword;