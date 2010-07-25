
var ws = require( "websocket-server" )
  , connect = require( "connect" )
  , pathToFiles = "/static"
  , server = connect.createServer(

  connect.staticProvider( __dirname + pathToFiles )

)

//Wrap out Connect server
server = ws.createServer( { debug : false }, server )

server.addListener( "connection", function( conn ) {

  console.log( "opened connection: " + conn.id )
  server.send( conn.id, "Connected as: " + conn.id )
  conn.broadcast( "<" + conn.id + "> connected" )

  conn.addListener( "message", function( message ) {
    console.log( "<" + conn.id + "> " + message )
    conn.broadcast( "<" + conn.id + "> " + message )
  } )
} )

server.addListener( "close", function( conn ) {

  console.log( "closed connection: " + conn.id )
  conn.broadcast( "<" + conn.id + "> disconnected" )

} )

server.listen( 8000 )

//Add our TCP server

var net = require( "net" )
  , domains = [ "localhost:8000" ]


net.createServer( function( socket ) {

  socket.write( "<?xml version=\"1.0\"?>\n" )
  socket.write( "<!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">\n" )
  socket.write( "<cross-domain-policy>\n" )

  domains.forEach(function ( domain ) {
    var parts = domain.split( ':' )
    socket.write( "<allow-access-from domain=\"" + parts[0] + "\" to-ports=\"" + (parts[1] || '80') + "\"/>\n" )
  } )

  socket.write( "</cross-domain-policy>\n" )
  socket.end()
  
} ).listen( 843 )
