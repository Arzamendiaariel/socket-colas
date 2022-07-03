const TicketControl = require("../models/ticket-control");


const ticketControl = new TicketControl()

const socketController = (socket) => {

    //se disparan estos eventos ante la conexión de un nuevo cliente
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit('estado-actual', ticketControl.ultimos4);    
    socket.emit('tickets-pendientes', ticketControl.tickets.length) ;

    socket.on('siguiente-ticket', ( payload, callback ) => {

        const siguiente = ticketControl.siguiente();
        //retorna un string que lo mando al callback
        callback(siguiente); 
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length) ;

       
    });

    socket.on('atender-ticket', ({escritorio}, callback)=>{

        if( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }
        
        const ticket = ticketControl.atenderTicket( escritorio );
        //cada vez que atiendo gente, cambian los ultimos 4 tickets y tengo que modificar la pantalla
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length) ;
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length) ;
        

        if ( !ticket ) {
            callback({
                ok: false,
                msg:'Ya no hay tickets pendients'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });


}



module.exports = {
    socketController
}

