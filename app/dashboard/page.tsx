"use client";

import { FormEvent, useEffect, useState } from "react";

const API_URL = "http://localhost:3001";

type Client = { id: string; name: string; email: string; phone: string };
type Address = { id: string; clientId: string; street: string; city: string; state: string; zip: string };
type ClientForm = Omit<Client, "id">;
type AddressForm = Omit<Address, "id" | "clientId">;

const emptyClient: ClientForm = { name: "", email: "", phone: "" };
const emptyAddress: AddressForm = { street: "", city: "", state: "", zip: "" };

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [clientForm, setClientForm] = useState<ClientForm>(emptyClient);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [clientError, setClientError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clients`);
      if (!response.ok) throw new Error();
      setClients(await response.json());
      setError("");
    } catch {
      setError("Could not connect to JSON Server. Start it with npm run dev:all.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => { void loadClients(); });
  }, []);

  async function openClient(client: Client) {
    setSelectedClient(client);
    setAddressError("");
    try {
      const response = await fetch(`${API_URL}/address`);
      if (!response.ok) throw new Error();
      const allAddresses: Address[] = await response.json();
      setAddresses(allAddresses.filter((address) => address.clientId === client.id));
    } catch {
      setAddressError("Could not load this client's addresses.");
      setAddresses([]);
    }
  }

  function beginCreateClient() {
    setEditingClientId(null); setClientForm(emptyClient); setClientError(""); setShowClientForm(true);
  }

  function beginEditClient(client: Client) {
    setEditingClientId(client.id); setClientForm({ name: client.name, email: client.email, phone: client.phone }); setClientError(""); setShowClientForm(true);
  }

  async function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientForm.name.trim()) { setClientError("Client name is required."); return; }
    const method = editingClientId ? "PATCH" : "POST";
    const url = editingClientId ? `${API_URL}/clients/${editingClientId}` : `${API_URL}/clients`;
    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...clientForm, name: clientForm.name.trim() }) });
      if (!response.ok) throw new Error();
      const savedClient: Client = await response.json();
      setClients((current) => editingClientId ? current.map((client) => client.id === savedClient.id ? savedClient : client) : [...current, savedClient]);
      if (selectedClient?.id === savedClient.id) setSelectedClient(savedClient);
      setShowClientForm(false); setClientForm(emptyClient); setClientError("");
    } catch { setClientError("Could not save the client. Please try again."); }
  }

  async function deleteClient(client: Client) {
    if (!window.confirm(`Delete ${client.name}?`)) return;
    try {
      const response = await fetch(`${API_URL}/clients/${client.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setClients((current) => current.filter((item) => item.id !== client.id));
      if (selectedClient?.id === client.id) { setSelectedClient(null); setAddresses([]); }
    } catch { setError("Could not delete the client. Please try again."); }
  }

  function beginCreateAddress() {
    setEditingAddressId(null); setAddressForm(emptyAddress); setAddressError(""); setShowAddressForm(true);
  }

  function beginEditAddress(address: Address) {
    setEditingAddressId(address.id); setAddressForm({ street: address.street, city: address.city, state: address.state, zip: address.zip }); setAddressError(""); setShowAddressForm(true);
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;
    if (!addressForm.street.trim() || !addressForm.city.trim()) { setAddressError("Street and city are required."); return; }
    const method = editingAddressId ? "PATCH" : "POST";
    const url = editingAddressId ? `${API_URL}/address/${editingAddressId}` : `${API_URL}/address`;
    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...addressForm, clientId: selectedClient.id }) });
      if (!response.ok) throw new Error();
      const savedAddress: Address = await response.json();
      setAddresses((current) => editingAddressId ? current.map((address) => address.id === savedAddress.id ? savedAddress : address) : [...current, savedAddress]);
      setShowAddressForm(false); setAddressForm(emptyAddress); setAddressError("");
    } catch { setAddressError("Could not save the address. Please try again."); }
  }

  async function deleteAddress(address: Address) {
    if (!window.confirm("Delete this address?")) return;
    try {
      const response = await fetch(`${API_URL}/address/${address.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setAddresses((current) => current.filter((item) => item.id !== address.id));
    } catch { setAddressError("Could not delete the address. Please try again."); }
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header"><div className="dashboard-brand"><span className="brand-mark small">N</span> NORTHSTAR</div><div className="user-menu"><span className="avatar">AM</span><span>Alex Morgan</span><span aria-hidden="true">⌄</span></div></header>
      <section className="dashboard-content">
        <div className="dashboard-heading"><div><p className="eyebrow">CLIENT DIRECTORY</p><h1>Your clients.</h1><p className="dashboard-subtitle">Keep every relationship and address in one clear view.</p></div><button className="new-project" type="button" onClick={beginCreateClient}>+ Add client</button></div>
        {error && <p className="api-error" role="alert">{error}</p>}
        <div className="client-layout">
          <section className="clients-panel" aria-label="Clients"><div className="section-heading"><h2>All clients <span className="count-badge">{clients.length}</span></h2></div>{loading ? <p className="empty-state">Loading clients...</p> : clients.length === 0 ? <p className="empty-state">No clients yet. Add your first client to get started.</p> : <div className="client-list">{clients.map((client) => <article className={`client-row ${selectedClient?.id === client.id ? "selected" : ""}`} key={client.id}><button className="client-select" type="button" onClick={() => void openClient(client)}><span className="client-avatar">{client.name.charAt(0).toUpperCase()}</span><span className="client-summary"><strong>{client.name}</strong><small>{client.email || "No email provided"}</small></span></button><span className="row-actions"><button type="button" className="text-action" onClick={() => beginEditClient(client)}>Edit</button><button type="button" className="text-action danger" onClick={() => void deleteClient(client)}>Delete</button></span></article>)}</div>}</section>
          <section className="client-detail" aria-label="Client details">{!selectedClient ? <div className="detail-placeholder"><span className="placeholder-mark">↗</span><h2>Select a client</h2><p>Choose a client to view and manage their addresses.</p></div> : <><div className="detail-heading"><div><p className="eyebrow">CLIENT PROFILE</p><h2>{selectedClient.name}</h2><p>{selectedClient.email || "No email provided"}{selectedClient.phone ? ` · ${selectedClient.phone}` : ""}</p></div><button className="outline-button" type="button" onClick={() => beginEditClient(selectedClient)}>Edit client</button></div><div className="section-heading address-heading"><h3>Addresses <span className="count-badge">{addresses.length}</span></h3><button className="small-action" type="button" onClick={beginCreateAddress}>+ Add address</button></div>{addressError && <p className="form-error" role="alert">{addressError}</p>}{addresses.length === 0 ? <p className="empty-state compact">No addresses saved for this client.</p> : <div className="address-list">{addresses.map((address) => <article className="address-row" key={address.id}><div><strong>{address.street}</strong><p>{address.city}{address.state ? `, ${address.state}` : ""} {address.zip}</p></div><span className="row-actions"><button type="button" className="text-action" onClick={() => beginEditAddress(address)}>Edit</button><button type="button" className="text-action danger" onClick={() => void deleteAddress(address)}>Delete</button></span></article>)}</div>}</>}</section>
        </div>
      </section>
      {showClientForm && <div className="modal-backdrop"><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="client-form-title"><div className="modal-heading"><div><p className="eyebrow">CLIENT DIRECTORY</p><h2 id="client-form-title">{editingClientId ? "Edit client" : "Add a client"}</h2></div><button className="close-button" type="button" aria-label="Close" onClick={() => setShowClientForm(false)}>×</button></div><form className="data-form" onSubmit={(event) => void saveClient(event)}><label htmlFor="client-name">Name <span>*</span></label><input id="client-name" value={clientForm.name} onChange={(event) => setClientForm({ ...clientForm, name: event.target.value })} placeholder="Jane Smith" required autoFocus /><label htmlFor="client-email">Email</label><input id="client-email" type="email" value={clientForm.email} onChange={(event) => setClientForm({ ...clientForm, email: event.target.value })} placeholder="jane@company.com" /><label htmlFor="client-phone">Phone</label><input id="client-phone" value={clientForm.phone} onChange={(event) => setClientForm({ ...clientForm, phone: event.target.value })} placeholder="555-555-0100" />{clientError && <p className="form-error" role="alert">{clientError}</p>}<div className="modal-actions"><button className="cancel-button" type="button" onClick={() => setShowClientForm(false)}>Cancel</button><button className="submit-button" type="submit">{editingClientId ? "Save changes" : "Add client"}</button></div></form></section></div>}
      {showAddressForm && selectedClient && <div className="modal-backdrop"><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="address-form-title"><div className="modal-heading"><div><p className="eyebrow">{selectedClient.name.toUpperCase()}</p><h2 id="address-form-title">{editingAddressId ? "Edit address" : "Add an address"}</h2></div><button className="close-button" type="button" aria-label="Close" onClick={() => setShowAddressForm(false)}>×</button></div><form className="data-form" onSubmit={(event) => void saveAddress(event)}><label htmlFor="street">Street <span>*</span></label><input id="street" value={addressForm.street} onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })} placeholder="123 Main St" required autoFocus /><div className="form-columns"><div><label htmlFor="city">City <span>*</span></label><input id="city" value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} placeholder="Anytown" required /></div><div><label htmlFor="state">State</label><input id="state" value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })} placeholder="CA" /></div></div><label htmlFor="zip">ZIP code</label><input id="zip" value={addressForm.zip} onChange={(event) => setAddressForm({ ...addressForm, zip: event.target.value })} placeholder="12345" />{addressError && <p className="form-error" role="alert">{addressError}</p>}<div className="modal-actions"><button className="cancel-button" type="button" onClick={() => setShowAddressForm(false)}>Cancel</button><button className="submit-button" type="submit">{editingAddressId ? "Save changes" : "Add address"}</button></div></form></section></div>}
    </main>
  );
}