import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

const styles = `
  /* --- Global & App Layout --- */
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #1f2937;
  }

  .app-container {
    background-color: #f3f4f6;
    min-height: 100vh;
  }

  .main-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
  }

  .card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    margin-top: 1.5rem;
  }

  /* --- Header & Navigation --- */
  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .header-title {
    font-size: 1.875rem;
    font-weight: bold;
    color: #111827;
  }

  .header-subtitle {
    color: #6b7280;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    position: relative;
  }

  /* --- Typography & Common Elements --- */
  .view-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
  .view-subtitle { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
  .loading { text-align: center; padding: 2.5rem; }
  .error-message { text-align: center; padding: 1rem; color: #b91c1c; background-color: #fee2e2; border-radius: 0.5rem; }
  .text-right { text-align: right; }
  .text-muted { color: #6b7280; font-size: 0.875rem; }
  .font-medium { font-weight: 500; }
  .font-bold { font-weight: 700; }
  .font-mono { font-family: monospace; }

  /* --- Buttons & Dropdowns --- */
  .button-primary, .button-secondary, .nav-button, .link-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
  }
  .button-primary { color: white; background-color: #2563eb; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
  .button-primary:hover { background-color: #1d4ed8; }
  .button-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }
  .button-secondary { color: #374151; background-color: white; border-color: #d1d5db; }
  .button-secondary:hover { background-color: #f9fafb; }
  .nav-button { color: #4b5563; }
  .nav-button:hover { background-color: #e5e7eb; }
  .link-button { color: #2563eb; background: none; border: none; padding: 0; }
  .link-button:hover { text-decoration: underline; }
  .back-button { margin-bottom: 1rem; }
  
  .dropdown {
    position: relative;
    display: inline-block;
  }
  .dropdown-content {
    display: block;
    position: absolute;
    right: 0;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 10;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  .dropdown-content button {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
  }
  .dropdown-content button:hover {background-color: #f1f1f1}

  /* --- Tables --- */
  .table-container { overflow-x: auto; }
  .data-table { width: 100%; text-align: left; border-collapse: collapse; }
  .data-table th { background-color: #f9fafb; padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #e5e7eb;}
  .data-table th button {
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .data-table td { padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
  .data-table tr:hover { background-color: #f9fafb; }

  /* --- Dashboard --- */
  .stats-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  .stat-card { padding: 1.5rem; border-radius: 0.5rem; }
  .stat-card h3 { font-weight: 500; margin: 0; }
  .stat-card p { font-size: 2.25rem; font-weight: bold; margin-top: 0.5rem; }
  .stat-card-blue { background-color: #eff6ff; color: #1e40af; }
  .stat-card-green { background-color: #f0fdf4; color: #166534; }
  .recent-items { margin-top: 2rem; }

  /* --- Item Detail View --- */
  .item-detail-header { margin-bottom: 1.5rem; }
  .stock-count { margin-top: 0.5rem; font-size: 2.25rem; font-weight: bold; }
  .stock-count span { font-size: 1.125rem; font-weight: 400; }
  .movement-type { display: flex; align-items: center; gap: 0.5rem; }
  .icon { width: 1.25rem; height: 1.25rem; }
  .icon-in { color: #22c55e; }
  .icon-out { color: #ef4444; }
  .icon-move { color: #3b82f6; }

  .movement-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  .summary-card {
    background-color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
  }
  .summary-card h4 {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
    color: #6b7280;
    font-size: 0.875rem;
  }
  .summary-card p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .summary-in { color: #16a34a; }
  .summary-out { color: #dc2626; }
  .summary-move { color: #2563eb; }


  /* --- Modal --- */
  .modal-overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 50; padding: 1rem;}
  .modal-content { 
    background-color: white; 
    border-radius: 0.5rem; 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
    width: 100%; 
    max-width: 32rem; 
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  .modal-title { font-size: 1.5rem; font-weight: bold; padding: 2rem 2rem 0 2rem; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.5rem 2rem 2rem 2rem; border-top: 1px solid #e5e7eb; }
  .modal-body {
    overflow-y: auto;
    padding: 1.5rem 2rem;
    flex-grow: 1;
  }

  /* --- Form --- */
  .form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  .form-group { position: relative; }
  .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
  .form-group input, .form-group select, .form-group textarea { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.5rem 0.75rem; box-sizing: border-box; font-family: inherit; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #3b82f6; box-shadow: 0 0 0 2px #3b82f6; }
  
  /* --- Toast Notifications --- */
  .toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
  }
  .toast {
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    margin-top: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: toast-in 0.5s, toast-out 0.5s 2.5s;
  }
  .toast.success { background-color: #22c55e; }
  .toast.error { background-color: #ef4444; }
  @keyframes toast-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes toast-out { from { transform: translateX(0); } to { transform: translateX(100%); } }

  /* --- Responsive Design --- */
  @media (min-width: 640px) {
    .header { flex-direction: row; }
    .nav { margin-top: 0; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://127.0.0.1:8000/ws/inventory/';

const api = {
  get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`).then(res => res.ok ? res.json() : Promise.reject(res)),
  post: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) return res.json().then(err => Promise.reject(err));
    return res.json();
  }),
};

const handleApiError = (err) => {
  if (Array.isArray(err)) return err[0];
  if (typeof err === 'object' && err !== null) {
    return Object.entries(err).map(([key, value]) => {
      const message = Array.isArray(value) ? value.join(', ') : value;
      if (key === 'non_field_errors' || key === 'detail') return message;
      return `${key}: ${message}`;
    }).join('; ');
  }
  return 'An unknown error occurred.';
};

// --- Toast Notification System ---
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- Sorting Hook ---
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};


const ArrowUpIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-in" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg> );
const ArrowDownIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-out" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-7.707a1 1 0 001.414 1.414l3-3a1 1 0 00-1.414-1.414L11 10.586V7a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3z" clipRule="evenodd" /></svg> );
const ArrowRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-move" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg> );

export default function App() {
  return (
    <ToastProvider>
      <WarehouseApp />
    </ToastProvider>
  );
}

function WarehouseApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, totalStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    return () => { document.head.removeChild(styleElement); };
  }, []);

  const fetchData = useCallback(async (isUpdate = false) => {
    if (!isUpdate) setLoading(true);
    try {
      setError(null);
      const [itemsData, zonesData, categoriesData] = await Promise.all([
        api.get('/items/'),
        api.get('/zones/'),
        api.get('/categories/'),
      ]);
      setItems(itemsData);
      setZones(zonesData);
      setCategories(categoriesData);
      
      const totalStock = itemsData.reduce((sum, item) => sum + item.total_quantity, 0);
      setStats({ totalItems: itemsData.length, totalStock });
    } catch (err) {
      setError('Failed to fetch initial data. Is your Django server running?');
      addToast('Could not fetch data from server.', 'error');
    } finally {
      if (!isUpdate) setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
    const socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'inventory_update') {
        addToast('Inventory updated!', 'success');
        fetchData(true);
        if (currentView === 'detail' && selectedItem) {
          fetchMovements(selectedItem.id);
        }
      }
    };
    socket.onclose = () => console.log('WebSocket disconnected.');
    socket.onerror = (error) => console.error('WebSocket error:', error);
    return () => socket.close();
  }, [fetchData, currentView, selectedItem, addToast]);


  const fetchMovements = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const movementData = await api.get(`/movements/?item=${itemId}`);
      setMovements(movementData);
    } catch (err) {
      setError('Failed to fetch movement history.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewItemDetail = (item) => {
    setSelectedItem(item);
    fetchMovements(item.id);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setMovements([]);
    setCurrentView('items');
  };

  const handleSave = () => {
    setModalType(null);
    fetchData(); 
    if (selectedItem) {
      fetchMovements(selectedItem.id);
    }
  };

  const renderView = () => {
    if (loading && !modalType) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    
    switch (currentView) {
      case 'items':
        return <ItemListView items={items} onViewDetail={handleViewItemDetail} />;
      case 'detail':
        const currentItem = items.find(i => i.id === selectedItem.id) || selectedItem;
        return <ItemDetailView item={currentItem} movements={movements} onBack={handleBackToList} />;
      default:
        return <DashboardView stats={stats} recentItems={items.slice(0, 5)} />;
    }
  };

  const renderModal = () => {
    if (!modalType) return null;
    if (modalType === 'movement') {
      return <MovementModal items={items} zones={zones} onClose={() => setModalType(null)} onSave={handleSave} />;
    }
    return <AddMasterDataModal type={modalType} categories={categories} onClose={() => setModalType(null)} onSave={handleSave} />;
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Header onNavigate={setCurrentView} onOpenModal={setModalType} />
        <main className="card">
          {renderView()}
        </main>
      </div>
      {renderModal()}
    </div>
  );
}


function Header({ onNavigate, onOpenModal }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div>
        <h1 className="header-title">Warehouse Tracker</h1>
        <p className="header-subtitle">Real-time inventory management</p>
      </div>
      <nav className="nav">
        <button onClick={() => onNavigate('dashboard')} className="nav-button">Dashboard</button>
        <button onClick={() => onNavigate('items')} className="nav-button">All Items</button>
        <div className="dropdown">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} onBlur={() => setIsDropdownOpen(false)} className="button-secondary">Manage</button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <button onMouseDown={() => onOpenModal('item')}>New Item</button>
              <button onMouseDown={() => onOpenModal('category')}>New Category</button>
              <button onMouseDown={() => onOpenModal('zone')}>New Zone</button>
            </div>
          )}
        </div>
        <button onClick={() => onOpenModal('movement')} className="button-primary">Log Movement</button>
      </nav>
    </header>
  );
}

function DashboardView({ stats, recentItems }) {
  return (
    <div>
      <h2 className="view-title">Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card stat-card-blue"><h3>Total Unique Items</h3><p>{stats.totalItems}</p></div>
        <div className="stat-card stat-card-green"><h3>Total Stock Quantity</h3><p>{stats.totalStock}</p></div>
      </div>
      <div className="recent-items">
        <h3 className="view-subtitle">Recently Added Items</h3>
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>SKU</th><th>Name</th><th className="text-right">Quantity</th></tr></thead>
            <tbody>
              {recentItems.map(item => (
                <tr key={item.id}>
                  <td className="text-muted">{item.sku}</td>
                  <td className="font-medium">{item.name}</td>
                  <td className="text-right font-mono">{item.total_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ItemListView({ items, onViewDetail }) {
  const { items: sortedItems, requestSort, sortConfig } = useSortableData(items);
  const getSortIndicator = (name) => {
    if (!sortConfig || sortConfig.key !== name) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div>
      <h2 className="view-title">Inventory Items</h2>
      <div className="table-container">
        <table className="data-table">
          <thead><tr>
            <th><button onClick={() => requestSort('sku')}>{getSortIndicator('sku')} SKU</button></th>
            <th><button onClick={() => requestSort('name')}>{getSortIndicator('name')} Name</button></th>
            <th><button onClick={() => requestSort('category_name')}>{getSortIndicator('category_name')} Category</button></th>
            <th className="text-right"><button onClick={() => requestSort('total_quantity')}>{getSortIndicator('total_quantity')} Total Quantity</button></th>
            <th></th>
          </tr></thead>
          <tbody>
            {sortedItems.map(item => (
              <tr key={item.id}>
                <td className="text-muted">{item.sku}</td>
                <td className="font-medium">{item.name}</td>
                <td className="text-muted">{item.category_name}</td>
                <td className="text-right font-bold font-mono">{item.total_quantity}</td>
                <td className="text-right"><button onClick={() => onViewDetail(item)} className="link-button">History</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemDetailView({ item, movements, onBack }) {
  const { items: sortedMovements, requestSort, sortConfig } = useSortableData(movements);
  const getSortIndicator = (name) => {
    if (!sortConfig || sortConfig.key !== name) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const movementTotals = movements.reduce((acc, movement) => {
    const type = movement.movement_type;
    acc[type] = (acc[type] || 0) + movement.quantity;
    return acc;
  }, { IN: 0, OUT: 0, MOVE: 0 });

  return (
    <div>
      <button onClick={onBack} className="link-button back-button">&larr; Back to Item List</button>
      <div className="item-detail-header">
        <h2 className="view-title">{item.name}</h2><p className="text-muted">{item.sku}</p>
        <p className="stock-count">{item.total_quantity} <span>in stock</span></p>
      </div>

      <div className="movement-summary">
        <div className="summary-card"><h4>Total In</h4><p className="summary-in">{movementTotals.IN}</p></div>
        <div className="summary-card"><h4>Total Out</h4><p className="summary-out">{movementTotals.OUT}</p></div>
        <div className="summary-card"><h4>Total Moved</h4><p className="summary-move">{movementTotals.MOVE}</p></div>
      </div>

      <h3 className="view-subtitle">Movement History</h3>
      <div className="table-container">
        <table className="data-table">
          <thead><tr>
            <th><button onClick={() => requestSort('movement_type')}>{getSortIndicator('movement_type')} Type</button></th>
            <th className="text-right"><button onClick={() => requestSort('quantity')}>{getSortIndicator('quantity')} Quantity</button></th>
            <th><button onClick={() => requestSort('from_zone_name')}>{getSortIndicator('from_zone_name')} From</button></th>
            <th><button onClick={() => requestSort('to_zone_name')}>{getSortIndicator('to_zone_name')} To</button></th>
            <th><button onClick={() => requestSort('timestamp')}>{getSortIndicator('timestamp')} Date</button></th>
            <th>Description</th>
          </tr></thead>
          <tbody>
            {sortedMovements.map(m => (
              <tr key={m.id}>
                <td><span className="movement-type">
                    {m.movement_type === 'IN' && <><ArrowUpIcon /> Stock In</>}
                    {m.movement_type === 'OUT' && <><ArrowDownIcon /> Stock Out</>}
                    {m.movement_type === 'MOVE' && <><ArrowRightIcon /> Move</>}
                </span></td>
                <td className="text-right font-mono">{m.quantity}</td>
                <td>{m.from_zone_name || 'N/A'}</td>
                <td>{m.to_zone_name || 'N/A'}</td>
                <td className="text-muted">{new Date(m.timestamp).toLocaleString()}</td>
                <td className="text-muted">{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MovementModal({ items, zones, onClose, onSave }) {
  const [movementType, setMovementType] = useState('IN');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fromZone, setFromZone] = useState('');
  const [toZone, setToZone] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const addToast = useToast();

  const selectedItem = items.find(i => i.id === parseInt(selectedItemId, 10));
  const zonesWithStock = selectedItem?.inventory_levels.filter(inv => inv.quantity > 0) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { item: selectedItemId, quantity: parseInt(quantity, 10), movement_type: movementType, description, from_zone: fromZone || null, to_zone: toZone || null };
    try {
      await api.post('/movements/', payload);
      addToast('Movement saved successfully!', 'success');
      onSave();
    } catch (err) {
      addToast(handleApiError(err), 'error');
      setIsSaving(false);
    }
  };

  useEffect(() => { setFromZone(''); setToZone(''); }, [movementType, selectedItemId]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Log New Movement</h2>
        <div className="modal-body">
          <form id="movement-form" onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group"><label>Movement Type</label><select value={movementType} onChange={e => setMovementType(e.target.value)}><option value="IN">Stock In</option><option value="OUT">Stock Out</option><option value="MOVE">Internal Move</option></select></div>
                <div className="form-group"><label>Item</label><select required value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}><option value="">Select an item...</option>{items.map(item => <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>)}</select></div>
                <div className="form-group"><label>Quantity</label><input type="number" required min="1" value={quantity} onChange={e => setQuantity(e.target.value)} /></div>
                
                {movementType !== 'IN' && (
                  <div className="form-group">
                    <label>From Zone</label>
                    <select required value={fromZone} onChange={e => setFromZone(e.target.value)} disabled={!selectedItemId}>
                      <option value="">{selectedItemId ? 'Select a zone...' : 'Select an item first'}</option>
                      {zonesWithStock.map(inv => 
                        <option key={inv.zone} value={inv.zone}>
                          {inv.zone_name} (Available: {inv.quantity})
                        </option>
                      )}
                    </select>
                  </div>
                )}

                {movementType !== 'OUT' && (
                  <div className="form-group">
                    <label>To Zone</label>
                    <select required value={toZone} onChange={e => setToZone(e.target.value)}>
                      <option value="">Select a zone...</option>
                      {zones.map(zone => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="form-group"><label>Description (Optional)</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} /></div>
            </div>
          </form>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" form="movement-form" disabled={isSaving} className="button-primary">{isSaving ? 'Saving...' : 'Save Movement'}</button>
        </div>
      </div>
    </div>
  );
}

function AddMasterDataModal({ type, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const addToast = useToast();

  const titles = { item: 'Add New Item', category: 'Add New Category', zone: 'Add New Zone' };
  const endpoints = { item: '/items/', category: '/categories/', zone: '/zones/' };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post(endpoints[type], formData);
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`, 'success');
      onSave();
    } catch (err) {
      addToast(handleApiError(err), 'error');
      setIsSaving(false);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case 'item':
        return (<>
          <div className="form-group"><label>SKU</label><input type="text" name="sku" required onChange={handleChange} /></div>
          <div className="form-group"><label>Name</label><input type="text" name="name" required onChange={handleChange} /></div>
          <div className="form-group"><label>Category</label><select name="category" required onChange={handleChange} defaultValue=""><option value="" disabled>Select a category...</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
        </>);
      case 'category':
        return (<>
          <div className="form-group"><label>Name</label><input type="text" name="name" required onChange={handleChange} /></div>
          <div className="form-group"><label>Description (Optional)</label><textarea name="description" rows="3" onChange={handleChange}></textarea></div>
        </>);
      case 'zone':
        return (<>
          <div className="form-group"><label>Name</label><input type="text" name="name" required onChange={handleChange} /></div>
          <div className="form-group"><label>Description (Optional)</label><textarea name="description" rows="3" onChange={handleChange}></textarea></div>
        </>);
      default: return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{titles[type]}</h2>
        <div className="modal-body">
          <form id={`form-${type}`} onSubmit={handleSubmit}>
            <div className="form-grid">{renderFormFields()}</div>
          </form>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" form={`form-${type}`} disabled={isSaving} className="button-primary">{isSaving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
