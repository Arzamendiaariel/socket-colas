const path = require('path');
const fs = require('fs');

class Ticket{
    constructor(numero, escritorio){
        this.numero = numero,
        this.escritorio = escritorio
    };
};

class TicketControl {
    constructor() {
        this.ultimo   = 0; //ultimo ticket que estoy atendiendo
        this.hoy      = new Date().getDate(); //me sirve para reinicializar dia a dia
        this.tickets  = []; //tickets pendientes
        this.ultimos4 = []; //para ser los que estan mostrándose en pantalla
        
        this.init();
    }
    get toJson(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    init(){
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json')
        if( hoy === this.hoy ){
            this.ultimo   = ultimo;
            this.tickets  = tickets;
            this.ultimos4 = ultimos4;
        } else {
            //es otro dia
            this.guardarDB();
        }
    }

    guardarDB(){
        //defino el path
        const dbPath = path.join(__dirname, '../db/data.json')
        //escribo en la base de datas el getter donde se tiene la información 
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }
    siguiente(){
        //sumo un nuevo numero
        this.ultimo += 1;
        //genero una nueva instancia de ticket
        const ticket = new Ticket( this.ultimo, null );
        //inserto el ticket en el array de tickets del constructor
        this.tickets.push( ticket );
        //actualizo la base de datos
        this.guardarDB();
     
        return 'Ticket ' + ticket.numero;
    }
    atenderTicket( escritorio ){
        //por prop llega el escritorio que "llama" al proximo ticket
        //si no hay tickets
        if(this.tickets.length === 0){
            return null;
        }

        //si hay tickets
        //saco del array de tickets al primero y lo "elimino" de dicho array
        const ticket = this.tickets.shift(); //this.tickets[0]
        //asigno el ticket selecionado al escritorio que lo llamó
        ticket.escritorio = escritorio;

        //ultimos 4 tickets llamados
        this.ultimos4.unshift( ticket );
        //valido que siempre sean  4 y nada más
        if( this.ultimos4.length > 4 ){
            //empieza desde la ultima posición del arreglo y la quita
            this.ultimos4.splice(-1, 1);
        }
        //guardo en la base de datos
        this.guardarDB();
        return ticket;
    }
}

module.exports = TicketControl