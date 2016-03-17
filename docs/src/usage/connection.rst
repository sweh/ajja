==============================
Behaviour on Connection Issues
==============================

If for any reason the server does not save requests made by `ajja`
(e.g. because there was a connection issue), those saves are retried once the
server is handling saves again. This happens as soon as the first save was
successful.

Furthermore, when saving the whole form all fields that were not saved on
change are saved immediatly. This makes sure that there are no field validation
errors left to be corrected by the user. There won't be a "save all" request
containing all field values. The backend must make sure that the single
requests for each field are saved.
