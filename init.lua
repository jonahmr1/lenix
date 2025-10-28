lib = {
  callback = IsDuplicityVersion() and requireModule('@tr_lib/modules/callback/server') or requireModule('@tr_lib/modules/callback/client'),
  split = requireModule('@tr_lib/modules/split/shared'),
  load = requireModule('@tr_lib/modules/load/shared'),
  print = requireModule('@tr_lib/modules/print/shared'),
  requireModule = requireModule('@tr_lib/modules/require/shared'),
}

exports('requireModule', lib.requireModule)
exports('print', lib.print)

return lib