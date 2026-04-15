import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import * as api from "../../services/api";
import toast from "react-hot-toast";

export const ProveedorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarProveedor = useCallback(async () => {
    try {
      const response = await api.obtenerProveedorPorId(id);
      if (response.error) {
        toast.error("Proveedor no encontrado");
        navigate(-1);
        return;
      }
      setProveedor(response.data?.proveedor || response.proveedor);
    } catch {
      toast.error("Error al cargar proveedor");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    cargarProveedor();
  }, [cargarProveedor]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!proveedor) return <div className="error">Proveedor no encontrado</div>;

  return (
    <div className="proveedor-detail">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">← Volver</button>
      <div className="detail-card">
        <h2>{proveedor.nombre}</h2>
        <div className="detail-grid">
          <div>
            <strong>Tipo Documento:</strong> {proveedor.tipoDocumento}
          </div>
          <div>
            <strong>Documento:</strong> {proveedor.numeroDocumento}
          </div>
          <div>
            <strong>NIT:</strong> {proveedor.nit || "-"}
          </div>
          <div>
            <strong>Correo:</strong> {proveedor.correo}
          </div>
          <div>
            <strong>Teléfono:</strong> {proveedor.telefono}
          </div>
          <div>
            <strong>Dirección:</strong> {proveedor.direccion}
          </div>
          <div>
            <strong>Ciudad:</strong> {proveedor.ciudad}
          </div>
          <div>
            <strong>Departamento:</strong> {proveedor.departamento}
          </div>
          <div>
            <strong>Condición Pago:</strong> {proveedor.condicionPago}
          </div>
          {proveedor.condicionPago === "CREDITO" && (
            <>
              <div>
                <strong>Días Crédito:</strong> {proveedor.diasCredito}
              </div>
              <div>
                <strong>Límite Mensual:</strong> Q{proveedor.limiteCreditoMes?.toLocaleString() || "0"}
              </div>
            </>
          )}
          <div>
            <strong>Banco:</strong> {proveedor.banco || "-"}
          </div>
          <div>
            <strong>Estado:</strong> {proveedor.estado ? "Activo" : "Inactivo"}
          </div>
        </div>
      </div>
    </div>
  );
};
