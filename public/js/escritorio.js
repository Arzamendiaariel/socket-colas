//referencias HTML

const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')

//leer los parametros del url
const searchParams = new URLSearchParams (window.location.search);

//explora si en la url esta "escritorio"
if (!searchParams.has('escritorio')){
    //reenvia al index
    window.location = 'index.html';
    //arroja error por falta de escritorio
    throw new Error ('El escritorio es Obligatorio');
};

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio; 
divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
     //si el server esta levantado el boton se habilita      
    btnAtender.disabled = false;    
});

socket.on('disconnect', () => {
    //si el server se cae el boton se deshabilita  
    btnAtender.disabled = true;    
});

socket.on( 'tickets-pendientes', ( pendientes ) =>{
    if( pendientes === 0 ){
        lblPendientes.style.display = 'none'
    } else {
        lblPendientes.style.display = ''       
        lblPendientes.innerText = pendientes
    }
 
});


btnAtender.addEventListener( 'click', () => {       

    socket.emit('atender-ticket', {escritorio}, ( {ok, ticket, msg} ) => {
        
        // si ya no hay mas tickets
        if (!ok) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`

    });
});