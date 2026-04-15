import { useState, useEffect } from "react";
import { useClientes } from "../../shared/hooks/useClientes";
import toast from "react-hot-toast";

const formatCurrency = (value = 0) =>
  `Q${Number(value || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const estadoClass = {
  PAGADA: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  PARCIAL: "bg-amber-100 text-amber-700 border border-amber-200",
  PENDIENTE: "bg-rose-100 text-rose-700 border border-rose-200",
  VENCIDA: "bg-red-100 text-red-700 border border-red-200",
};

export const ClientePortal = () => {
  const {
    loading,
    obtenerMiPerfilFunc,
    obtenerMisFacturasFunc,
    obtenerDetalleFacturaFunc,
    obtenerMisCobrosFunc,
    obtenerMiSaldoFunc,
    obtenerMisFacturasVencidasFunc,
    registrarMiPagoFunc,
  } = useClientes();

  const [miPerfil, setMiPerfil] = useState(null);
  const [misFacturas, setMisFacturas] = useState([]);
  const [misCobros, setMisCobros] = useState([]);
  const [miSaldo, setMiSaldo] = useState(null);
  const [misFacturasVencidas, setMisFacturasVencidas] = useState([]);
  const [pestana, setPestana] = useState("perfil");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalPagoVisible, setModalPagoVisible] = useState(false);
  const [datosPago, setDatosPago] = useState({
    montoPago: "",
    fechaPago: new Date().toISOString().split("T")[0],
    formaPago: "TRANSFERENCIA",
    referencias: "",
  });
  const [pagando, setPagando] = useState(false);

  const cargarDatos = async () => {
    const [resultadoPerfil, resultadoFacturas, resultadoCobros, resultadoSaldo, resultadoVencidas] = await Promise.all([
      obtenerMiPerfilFunc(),
      obtenerMisFacturasFunc(100, 0),
      obtenerMisCobrosFunc(100, 0),
      obtenerMiSaldoFunc(),
      obtenerMisFacturasVencidasFunc(100, 0),
    ]);

    if (!resultadoPerfil.error) {
      setMiPerfil(resultadoPerfil.data);
    } else {
      toast.error("No se pudo cargar tu perfil");
    }

    if (!resultadoFacturas.error) setMisFacturas(resultadoFacturas.data || []);
    if (!resultadoCobros.error) setMisCobros(resultadoCobros.data || []);
    if (!resultadoSaldo.error) setMiSaldo(resultadoSaldo.data);
    if (!resultadoVencidas.error) setMisFacturasVencidas(resultadoVencidas.data || []);
  };

  useEffect(() => {
    cargarDatos();
  }, [obtenerMiPerfilFunc, obtenerMisFacturasFunc, obtenerMisCobrosFunc, obtenerMiSaldoFunc, obtenerMisFacturasVencidasFunc]);

  const handleVerDetalleFactura = async (facturaId) => {
    const resultado = await obtenerDetalleFacturaFunc(facturaId);
    if (!resultado.error) {
      setFacturaSeleccionada(resultado.data);
      setModalDetalleVisible(true);
    } else {
      toast.error("No se pudo obtener el detalle de la factura");
    }
  };

  const handleAbrirModalPago = async (factura) => {
    const resultado = await obtenerDetalleFacturaFunc(factura._id || factura.id);
    if (!resultado.error) {
      const detalle = resultado.data;
      setFacturaSeleccionada(detalle);
      setDatosPago({
        montoPago: detalle.saldoPendiente || "",
        fechaPago: new Date().toISOString().split("T")[0],
        formaPago: "TRANSFERENCIA",
        referencias: "",
      });
      setModalPagoVisible(true);
    } else {
      toast.error("No se pudo obtener el detalle de la factura");
    }
  };

  const handleRegistrarPago = async () => {
    const monto = parseFloat(datosPago.montoPago || 0);
    if (monto <= 0) {
      toast.error("Ingresa un monto valido");
      return;
    }
    if (monto > Number(facturaSeleccionada?.saldoPendiente || 0)) {
      toast.error("El monto no puede ser mayor al saldo pendiente");
      return;
    }

    setPagando(true);
    const resultado = await registrarMiPagoFunc(facturaSeleccionada.id || facturaSeleccionada._id, {
      montoAbono: monto,
      fechaCobro: datosPago.fechaPago,
      formaPago: datosPago.formaPago,
      referencias: datosPago.referencias,
    });

    if (!resultado.error) {
      toast.success("Pago registrado correctamente");
      setModalDetalleVisible(false);
      setModalPagoVisible(false);
      await cargarDatos();
    } else {
      toast.error(resultado.message || "No se pudo registrar el pago");
    }
    setPagando(false);
  };

  const tabs = [
    { id: "perfil", label: "Mi perfil" },
    { id: "saldo", label: "Mi saldo" },
    { id: "facturas", label: `Mis facturas (${misFacturas.length})` },
    { id: "cobros", label: `Mis cobros (${misCobros.length})` },
    { id: "vencidas", label: `Facturas vencidas (${misFacturasVencidas.length})` },
  ];

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-blue-300/25 bg-blue-950/45 p-10 text-center shadow-2xl shadow-blue-900/30">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <p className="mt-4 text-base font-semibold text-slate-100">Cargando informacion de tu portal...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cliente-portal-page min-h-[calc(100vh-72px)] bg-gradient-to-br from-[#08142b] via-[#0b1e43] to-[#13326a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-blue-300/20 bg-slate-900/35 p-6 shadow-xl shadow-blue-900/25 backdrop-blur-sm">
          <h2 className="text-3xl font-black tracking-tight text-slate-100">Portal de Cliente</h2>
          <p className="mt-1 text-sm text-slate-300">{miPerfil ? `Bienvenido, ${miPerfil.nombre}` : "Consulta tu perfil, facturas y pagos"}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-blue-200/20 bg-white/95 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Facturas</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{misFacturas.length}</p>
          </article>
          <article className="rounded-2xl border border-blue-200/20 bg-white/95 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pagado</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{formatCurrency(miSaldo?.totalPagado)}</p>
          </article>
          <article className="rounded-2xl border border-blue-200/20 bg-white/95 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cobros</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{misCobros.length}</p>
          </article>
          <article className="rounded-2xl border border-blue-200/20 bg-white/95 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo pendiente</p>
            <p className={`mt-2 text-3xl font-black ${Number(miSaldo?.saldoPendiente || 0) > 0 ? "text-rose-700" : "text-emerald-700"}`}>
              {formatCurrency(miSaldo?.saldoPendiente)}
            </p>
          </article>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-blue-200/20 bg-slate-900/35 p-3 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPestana(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                pestana === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/30"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {pestana === "perfil" && miPerfil && (
          <div className="rounded-2xl border border-blue-200/20 bg-white/95 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">Informacion de la cuenta</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Nombre empresa", miPerfil.nombre],
                ["Contacto", miPerfil.nombreContacto || "-"],
                ["Correo", miPerfil.correo],
                ["Telefono", miPerfil.telefono],
                ["Telefono contacto", miPerfil.telefonoContacto || "-"],
                ["Correo contacto", miPerfil.correoContacto || "-"],
                ["Tipo documento", miPerfil.tipoDocumento],
                ["Numero documento", miPerfil.numeroDocumento],
                ["NIT", miPerfil.nit || "-"],
                ["Direccion", miPerfil.direccion || "-"],
                ["Ciudad", miPerfil.ciudad || "-"],
                ["Departamento", miPerfil.departamento || "-"],
                ["Condicion de pago", miPerfil.condicionPago],
                ["Dias de credito", miPerfil.condicionPago === "CREDITO" ? miPerfil.diasCredito : "-"],
                ["Limite credito mensual", miPerfil.condicionPago === "CREDITO" ? formatCurrency(miPerfil.limiteCreditoMes) : "-"],
                ["Banco", miPerfil.banco || "-"],
                ["Numero de cuenta", miPerfil.numeroCuenta || "-"],
              ].map(([label, value]) => (
                <article key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {pestana === "saldo" && miSaldo && (
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-rose-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo pendiente</p>
              <p className="mt-2 text-3xl font-black text-rose-700">{formatCurrency(miSaldo.saldoPendiente)}</p>
            </article>
            <article className="rounded-2xl border border-blue-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total facturas</p>
              <p className="mt-2 text-3xl font-black text-blue-700">{formatCurrency(miSaldo.totalFacturas)}</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total pagado</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{formatCurrency(miSaldo.totalPagado)}</p>
            </article>
          </div>
        )}

        {pestana === "facturas" && (
          <div className="overflow-hidden rounded-2xl border border-blue-200/20 bg-white/95 shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full cliente-portal-table">
                <thead className="bg-slate-700">
                  <tr>
                    {[
                      "Numero",
                      "Monto",
                      "Moneda",
                      "Estado",
                      "Fecha emision",
                      "Fecha vencimiento",
                      "Acciones",
                    ].map((head) => (
                      <th key={head} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-100">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {misFacturas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center font-semibold text-slate-500">No tienes facturas registradas</td>
                    </tr>
                  ) : (
                    misFacturas.map((factura) => (
                      <tr key={factura.id || factura._id} className="border-b border-slate-200/70 hover:bg-blue-50/60">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{factura.numeroFactura}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{formatCurrency(factura.monto)}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{factura.moneda}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${estadoClass[factura.estado] || "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                            {factura.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">{new Date(factura.fechaEmision).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{new Date(factura.fechaVencimiento).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <button onClick={() => handleVerDetalleFactura(factura.id || factura._id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pestana === "cobros" && (
          <div className="overflow-hidden rounded-2xl border border-blue-200/20 bg-white/95 shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full cliente-portal-table">
                <thead className="bg-slate-700">
                  <tr>
                    {["Comprobante", "Factura", "Monto", "Fecha cobro", "Metodo pago"].map((head) => (
                      <th key={head} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-100">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {misCobros.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center font-semibold text-slate-500">No tienes cobros registrados</td>
                    </tr>
                  ) : (
                    misCobros.map((cobro) => (
                      <tr key={cobro.id || cobro._id} className="border-b border-slate-200/70 hover:bg-blue-50/60">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{cobro.numeroComprobante}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{cobro.facturaPorCobrar?.numeroFactura || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{formatCurrency(cobro.montoCobrado)}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{new Date(cobro.fechaCobro).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{cobro.metodoPago}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pestana === "vencidas" && (
          <div className="overflow-hidden rounded-2xl border border-rose-200/40 bg-white/95 shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full cliente-portal-table">
                <thead className="bg-rose-700">
                  <tr>
                    {["Numero", "Monto", "Vencimiento", "Dias vencida", "Acciones"].map((head) => (
                      <th key={head} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-rose-50">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {misFacturasVencidas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center font-semibold text-emerald-700">No tienes facturas vencidas</td>
                    </tr>
                  ) : (
                    misFacturasVencidas.map((factura) => {
                      const fechaVencimiento = new Date(factura.fechaVencimiento);
                      const diasVencida = Math.floor((new Date() - fechaVencimiento) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={factura.id || factura._id} className="border-b border-rose-100 hover:bg-rose-50/60">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{factura.numeroFactura}</td>
                          <td className="px-4 py-3 text-sm text-slate-800">{formatCurrency(factura.monto)}</td>
                          <td className="px-4 py-3 text-sm text-slate-800">{fechaVencimiento.toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm font-bold text-rose-700">{diasVencida} dias</td>
                          <td className="px-4 py-3 text-sm">
                            <button onClick={() => handleVerDetalleFactura(factura.id || factura._id)} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700">
                              Ver
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalDetalleVisible && facturaSeleccionada && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/70 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-blue-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-900">Detalle de factura {facturaSeleccionada.numeroFactura}</h3>
              <button className="text-xl font-bold text-slate-500" onClick={() => setModalDetalleVisible(false)}>x</button>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monto</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{formatCurrency(facturaSeleccionada.monto)}</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{facturaSeleccionada.estado}</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha emision</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{new Date(facturaSeleccionada.fechaEmision).toLocaleDateString()}</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha vencimiento</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{new Date(facturaSeleccionada.fechaVencimiento).toLocaleDateString()}</p>
                </article>
              </div>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripcion</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{facturaSeleccionada.descripcion || "Sin descripcion"}</p>
              </article>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              {facturaSeleccionada.estado !== "PAGADA" && (
                <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={() => handleAbrirModalPago(facturaSeleccionada)}>
                  Registrar pago
                </button>
              )}
              <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => setModalDetalleVisible(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalPagoVisible && facturaSeleccionada && (
        <div className="fixed inset-0 z-[1001] grid place-items-center bg-slate-950/70 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-blue-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-900">Registrar pago {facturaSeleccionada.numeroFactura}</h3>
              <button className="text-xl font-bold text-slate-500" onClick={() => setModalPagoVisible(false)}>x</button>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:grid-cols-2">
                <p className="text-sm font-semibold text-slate-700">Monto total: <span className="font-bold text-slate-900">{formatCurrency(facturaSeleccionada.monto)}</span></p>
                <p className="text-sm font-semibold text-slate-700">Ya pagado: <span className="font-bold text-emerald-700">{formatCurrency(facturaSeleccionada.totalCobrado || 0)}</span></p>
                <p className="text-sm font-semibold text-slate-700 sm:col-span-2">Saldo pendiente: <span className="font-bold text-rose-700">{formatCurrency(facturaSeleccionada.saldoPendiente || 0)}</span></p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Monto a pagar</label>
                  <input
                    type="number"
                    value={datosPago.montoPago}
                    max={facturaSeleccionada.saldoPendiente}
                    step="0.01"
                    onChange={(e) => setDatosPago({ ...datosPago, montoPago: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Fecha de pago</label>
                  <input
                    type="date"
                    value={datosPago.fechaPago}
                    onChange={(e) => setDatosPago({ ...datosPago, fechaPago: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Forma de pago</label>
                  <select
                    value={datosPago.formaPago}
                    onChange={(e) => setDatosPago({ ...datosPago, formaPago: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="TRANSFERENCIA">Transferencia bancaria</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Referencias</label>
                  <textarea
                    rows="3"
                    value={datosPago.referencias}
                    onChange={(e) => setDatosPago({ ...datosPago, referencias: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => setModalPagoVisible(false)} disabled={pagando}>
                Cancelar
              </button>
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60" onClick={handleRegistrarPago} disabled={pagando}>
                {pagando ? "Registrando..." : "Confirmar pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
