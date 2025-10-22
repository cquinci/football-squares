import React, { useState, useMemo, useCallback, useEffect, Fragment } from 'react';

// --- CONFIGURATION --- //
// UPDATED API URL:
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbyvCAJZGa76qQ7ipJFqmmF4tH2GUXJuP7p4H6pQ08YcH0LXpfvtO1gZhqPwLVU7r0B4kQ/exec';

// --- HELPER ICONS --- //
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const RefreshCwIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
const Dice5Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M12 12h.01"></path><path d="M16 16h.01"></path><path d="M8 16h.01"></path></svg>;
const TrophyIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432L12.586 2.586z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>;
const Trash2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const AlertTriangleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const SlidersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>;


// --- CORE APPLICATION --- //

export default function App() {
  // --- STATE MANAGEMENT --- //
  const [players, setPlayers] = useState([]);
  const [settings, setSettings] = useState({
      'Home Team Name': 'Home', 'Away Team Name': 'Away', 'Cost Per Square': 10, 'Payment Methods': 'Venmo', 'Title': 'Super Bowl Squares'
  });
  const [scores, setScores] = useState([]);
  const [fullGameNumbers, setFullGameNumbers] = useState({ home: [], away: [] });
  const [fourQuarterNumbers, setFourQuarterNumbers] = useState({ q1: {}, q2: {}, q3: {}, q4: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [startupError, setStartupError] = useState(null);

  // UI State
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [formName, setFormName] = useState('');
  const [formInitials, setFormInitials] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('');
  const [numToRandomize, setNumToRandomize] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [localScores, setLocalScores] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // --- DATA FETCHING & FONT LOADING --- //
  const fetchData = useCallback(async (isInitialLoad = false) => {
    if(!isRefreshing) setIsRefreshing(true);
    if(!isInitialLoad && !isLoading) showToast('Syncing with Google Sheet...', 'info');
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setPlayers(data.players || []);
      setSettings(data.settings || {});
      setScores(data.scores || []);
      setLocalScores(data.scores || []);
      setFullGameNumbers(data.fullGameNumbers || { home: [], away: [] });
      setFourQuarterNumbers(data.fourQuarterNumbers || { q1: {}, q2: {}, q3: {}, q4: {} });
      setFormPaymentMethod((data.settings['Payment Methods'] || '').split(',')[0]);
        if(!isInitialLoad && !isLoading) showToast('Data synced!', 'success');
    } catch (error) {
      console.error("Failed to fetch data:", error);
      const errorMessage = `Error: ${error.message}`;
      if (error.message.includes("openById")) {
          const detailedError = "<b>Backend Error:</b> Your Spreadsheet ID is missing or incorrect in the Google Apps Script. Please update it and re-deploy.";
          if(isLoading) setStartupError(detailedError);
          showToast(detailedError, 'error');
      } else {
          if(isLoading) setStartupError(errorMessage);
          showToast(errorMessage, 'error');
      }
    } finally {
      if(isInitialLoad) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isLoading, isRefreshing]);

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    const style = document.createElement('style');
    style.textContent = `
      body, .font-russo { font-family: 'Russo One', sans-serif; }
      .font-sans-readable { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
      @keyframes roll { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .animate-roll { animation: roll 0.5s linear infinite; }
      .writing-mode-v-rl { writing-mode: vertical-rl; }
    `;
    document.head.appendChild(style);
    fetchData(true);
  }, []);

  // --- DERIVED STATE & MEMOIZATION --- //
  const claimedSquaresMap = useMemo(() => {
    const map = new Map();
    players.forEach(player => {
      if (player.Squares) {
        String(player.Squares).split(',').forEach(numStr => {
          if (numStr.trim() !== '') {
              map.set(parseInt(numStr.trim(), 10), { name: player.Name, initials: player.Initials, paid: player.Paid === 'Yes' });
          }
        });
      }
    });
    return map;
  }, [players]);

  const winningSquares = useMemo(() => {
    const winners = {};
    if (!scores || !settings) {
      return winners;
    }

    scores.forEach(score => {
        const { Quarter, 'Home Score': homeScore, 'Away Score': awayScore } = score;

        if (homeScore === '' || awayScore === '' || homeScore === undefined || awayScore === undefined) {
            return; // Skip if score is incomplete
        }

        const homeDigit = parseInt(String(homeScore).slice(-1), 10);
        const awayDigit = parseInt(String(awayScore).slice(-1), 10);

        let numbers;
        if (settings['Game Mode'] === 'Full Game') {
            numbers = fullGameNumbers;
        } else { // 4 Quarters Mode
            numbers = fourQuarterNumbers[Quarter.toLowerCase()];
        }

        if (numbers && numbers.home && numbers.home.length > 0 && numbers.away && numbers.away.length > 0) {
            const homeIndex = numbers.home.indexOf(homeDigit);
            const awayIndex = numbers.away.indexOf(awayDigit);

            if (homeIndex !== -1 && awayIndex !== -1) {
                winners[Quarter] = awayIndex * 10 + homeIndex + 1;
            }
        }
    });

    return winners;
  }, [scores, settings, fullGameNumbers, fourQuarterNumbers]);
  
  const paymentMethods = useMemo(() => (settings['Payment Methods'] || '').split(','), [settings]);
  
  // --- GENERAL FUNCTIONS --- //
  // Removed .replace() from function definition
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };
  
  const handleSquareClick = useCallback((squareNumber) => {
    if (claimedSquaresMap.has(squareNumber)) {
      showToast('This square is already taken.', 'error'); return;
    }
    setSelectedSquares(prev => prev.includes(squareNumber) ? prev.filter(s => s !== squareNumber) : [...prev, squareNumber]);
  }, [claimedSquaresMap]);

  const handleRandomizeSelection = () => {
    const availableSquares = Array.from({ length: 100 }, (_, i) => i + 1).filter(num => !claimedSquaresMap.has(num));
    const count = parseInt(numToRandomize, 10);
    if (isNaN(count) || count <= 0) { showToast('Please enter a valid number of squares.', 'error'); return; }
    if (availableSquares.length < count) { showToast(`Only ${availableSquares.length} squares are available.`, 'error'); return; }
    setSelectedSquares(availableSquares.sort(() => 0.5 - Math.random()).slice(0, count));
    showToast(`${count} random square(s) selected.`, 'info');
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formInitials.trim() || selectedSquares.length === 0) {
      showToast('Please enter your name, initials, and select at least one square.', 'error'); return;
    }
    setIsSubmitting(true);
    const payload = {
      action: 'claimSquare',
      payload: { 
        Name: formName, 
        Initials: formInitials, 
        Squares: selectedSquares.join(','), 
        PaymentMethod: formPaymentMethod, 
        Cost: selectedSquares.length * settings['Cost Per Square'] 
      }
    };
    try {
      const response = await fetch(API_BASE_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message);
      showToast('Success! Squares claimed.', 'success');
      setFormName('');
      setFormInitials('');
      setSelectedSquares([]);
      fetchData();
    } catch (error) {
      console.error("Failed to claim squares:", error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if(adminPassword === settings['Admin Password']) {
      setIsAdmin(true);
      setShowAdminPanel(true);
      showToast('Admin access granted.', 'success');
    } else {
      showToast('Incorrect password.', 'error');
    }
    setAdminPassword('');
  };

  // --- ADMIN ACTION FUNCTIONS --- //
  const postAdminAction = async (action, payload) => {
    try {
      showToast('Sending admin command...', 'info');
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action, payload }),
      });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message);
      showToast(`Success: ${result.message}`, 'success');
      fetchData();
      return true;
    } catch (error) {
      console.error(`Admin action "${action}" failed:`, error);
      if (error.message.includes("Missing required data for claiming a square") || error.message.includes("Invalid action")) {
          showToast("Error: Backend script outdated. Please update Google Apps Script and re-deploy.", 'error');
      } else {
          showToast(`Error: ${error.message}`, 'error');
      }
      return false;
    }
  };

  const handleMarkAsPaid = (playerName, status) => {
    postAdminAction('markAsPaid', { playerName, status });
  };
  
  const handleRandomizeNumbers = async (mode) => {
    if (claimedSquaresMap.size < 100) {
        showToast('All 100 squares must be claimed before randomizing.', 'error');
        return;
    }
    setIsRandomizing(true);
    await postAdminAction('randomizeNumbers', { mode });
    setIsRandomizing(false);
  };

  const handleLocalScoreChange = (quarter, team, value) => {
    setLocalScores(prevScores => prevScores.map(s => 
      s.Quarter === quarter ? { ...s, [team]: value } : s
    ));
  };
  
  const handleScoreUpdate = (quarter) => {
    const scoreToUpdate = localScores.find(s => s.Quarter === quarter);
    if (scoreToUpdate) {
      postAdminAction('updateScore', { 
        quarter, 
        homeScore: scoreToUpdate['Home Score'], 
        awayScore: scoreToUpdate['Away Score'] 
      });
    }
  };
  
  const handleDeletePlayer = (playerName) => {
    setConfirmModal({
        isOpen: true,
        title: `Delete ${playerName}?`,
        message: 'This will permanently remove the player and their squares. This action cannot be undone.',
        onConfirm: () => postAdminAction('deletePlayer', { playerName }),
    });
  };

  const handleNewGame = () => {
    setConfirmModal({
        isOpen: true,
        title: 'Start a New Game?',
        message: 'This will delete ALL players, scores, and randomized numbers. This action is permanent and cannot be undone.',
        onConfirm: () => postAdminAction('newGame', {}),
    });
  };

  const handleGameModeChange = (e) => {
    const newMode = e.target.value;
    setConfirmModal({
        isOpen: true,
        title: 'Change Game Mode?',
        message: `Are you sure you want to change the mode to "${newMode}"? This will be saved to your Google Sheet.`,
        onConfirm: () => postAdminAction('setGameMode', { mode: newMode }),
    });
  };

  // --- RENDER --- //
  if (isLoading) {
      return (<div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center"><RefreshCwIcon className="animate-spin h-12 w-12 mb-4"/><p className="text-xl font-russo">Loading Football Squares...</p></div>);
  }
  
  if (startupError) {
      return (
          <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
              <AlertTriangleIcon className="text-red-500 h-16 w-16 mb-4"/>
              <h2 className="text-2xl font-russo text-red-400 mb-2">Connection Error</h2>
              <div className="max-w-2xl bg-gray-800 p-4 rounded-lg font-sans-readable text-left">
                  <p className="mb-4">The application could not connect to the Google Sheet backend. This usually happens for one reason:</p>
                  <p><strong className="text-yellow-400">The Spreadsheet ID in your Google Apps Script is incorrect or missing.</strong></p>
                  <p className="mt-4 text-sm text-gray-400">Please open your Google Apps Script, replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID, and re-deploy the script as a new version.</p>
              </div>
          </div>
      );
  }

  const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md font-sans-readable">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-russo text-yellow-400"><AlertTriangleIcon className="text-yellow-400"/> {title}</h3>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end gap-4">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg font-russo">Cancel</button>
                <button onClick={() => { onConfirm(); onCancel(); }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg font-russo">Confirm</button>
            </div>
        </div>
      </div>
    );
  };
  
  const RandomizingModal = ({ isOpen }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
                <div className="flex justify-center gap-4 text-6xl mb-4">
                    <span className="animate-roll">🎲</span>
                    <span className="animate-roll" style={{animationDelay: '0.1s'}}>🎲</span>
                </div>
                <h3 className="text-2xl font-bold font-russo text-yellow-400">Randomizing Numbers...</h3>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-russo p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ConfirmationModal 
            isOpen={confirmModal.isOpen} 
            title={confirmModal.title}
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })} 
        />
        <RandomizingModal isOpen={isRandomizing} />
        <header className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-center md:justify-start gap-4 w-full md:w-1/3"><img src={settings['Away Team Logo URL']} alt={settings['Away Team Name']} className="h-10 w-10 sm:h-12 sm:w-12 object-contain"/><span className="text-lg sm:text-xl font-bold text-gray-300">{settings['Away Team Name']}</span></div>
            <div className="text-center w-full md:w-1/3 order-first md:order-none tracking-wider"><h1 className="text-xl sm:text-3xl font-bold text-yellow-400">{settings['Title'] || 'Super Bowl Squares'}</h1><span className="text-sm text-gray-400">{new Date().getFullYear()}</span></div>
            <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-1/3"><span className="text-lg sm:text-xl font-bold text-gray-300">{settings['Home Team Name']}</span><img src={settings['Home Team Logo URL']} alt={settings['Home Team Name']} className="h-10 w-10 sm:h-12 sm:w-12 object-contain"/></div>
        </header>

        <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg flex flex-col sm:flex-row items-center justify-around text-center gap-4">
            <div className="flex flex-col">
                <span className="text-sm text-gray-400 font-sans-readable">Total Pot</span>
                <span className="text-3xl font-bold text-green-400">${claimedSquaresMap.size * (settings['Cost Per Square'] || 0)}</span>
            </div>
            <div className="h-16 w-px bg-gray-600 hidden sm:block"></div>
            <div className="flex items-center gap-4 sm:gap-6 text-lg">
                <TrophyIcon className="text-yellow-400 h-8 w-8"/>
                <div className="text-left font-sans-readable">
                    <p><span className="font-bold text-orange-400">Q1:</span> ${settings['Payout Q1'] || '0'}</p>
                    <p><span className="font-bold text-yellow-300">Q2:</span> ${settings['Payout Q2'] || '0'}</p>
                </div>
                <div className="text-left font-sans-readable">
                    <p><span className="font-bold text-blue-400">Q3:</span> ${settings['Payout Q3'] || '0'}</p>
                    <p><span className="font-bold text-purple-400">Final:</span> ${settings['Payout Final'] || '0'}</p>
                </div>
            </div>
        </div>
        
        <div className="flex justify-between items-center mb-4 px-2 gap-2">
            <button onClick={() => fetchData(false)} disabled={isRefreshing} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 disabled:opacity-50"><RefreshCwIcon className={isRefreshing ? 'animate-spin' : ''}/><span className="hidden sm:inline">Sync</span></button>
            <div className="flex items-center gap-2 text-base font-bold bg-gray-800 px-3 py-2 rounded-lg"><TagIcon/><span>Cost:</span><span className="text-yellow-400">${settings['Cost Per Square']}</span></div>
            <button onClick={() => setShowAdminPanel(!showAdminPanel)} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-transform transform hover:scale-105"><LockIcon/><span className="hidden sm:inline">Admin</span></button>
        </div>

        <main className="flex flex-col lg:flex-row gap-6">
          {/* This is the grid container */}
          <div className="lg:w-2/3">
            {/* Home Team Name (Above Grid) */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mb-2 tracking-widest text-center">
              {settings['Home Team Name']}
            </h2>

            {/* Wrapper for Side Team Name + Grid */}
            <div className="flex items-center justify-center gap-2 sm:gap-4"> {/* Added items-center and justify-center */}
              
              {/* Away Team Name (Side) */}
              <h2 className="writing-mode-v-rl rotate-180 text-xl sm:text-2xl font-bold text-gray-300 tracking-widest text-center"> {/* Removed mt-12 */}
                {settings['Away Team Name']}
              </h2>

              {/* Main Grid - must have flex-1 to grow */}
              <div className="flex-1 bg-gray-800 p-1 sm:p-2 rounded-xl shadow-2xl relative overflow-x-auto">
                  <div className="grid grid-cols-11 gap-0.5 min-w-[500px] sm:min-w-full">
                      
                      {/* 1. Top-Left Special Corner - NOW HORIZONTAL */}
                      <div className="relative aspect-square bg-gray-700 rounded-sm flex items-center justify-around text-[8px] sm:text-[10px] font-sans-readable p-0.5 sm:p-1 overflow-hidden">
                        {settings['Game Mode'] === '4 Quarters' && (
                          <>
                            <span className="font-bold text-orange-400">Q1</span>
                            <span className="font-bold text-yellow-300">Q2</span>
                            <span className="font-bold text-blue-400">Q3</span>
                            <span className="font-bold text-purple-400">F</span>
                          </>
                        )}
                      </div>

                      {/* 2. Home Numbers (10 cols) - NOW INDIVIDUAL SQUARES */}
                      {Array.from({ length: 10 }).map((_, colIndex) => (
                        <div key={`home-header-${colIndex}`} className="flex items-center justify-center bg-gray-700 rounded-sm font-bold text-yellow-400 aspect-square p-0.5">
                          {settings['Game Mode'] === '4 Quarters' ? (
                            // This is now a grid of 4 vertical boxes
                            <div className="grid grid-rows-4 gap-0.5 text-center text-[10px] sm:text-base w-full h-full font-sans-readable">
                              <span className="flex items-center justify-center font-bold text-orange-400 bg-gray-800 rounded-sm">{fourQuarterNumbers.q1?.home?.[colIndex]}</span>
                              <span className="flex items-center justify-center font-bold text-yellow-300 bg-gray-800 rounded-sm">{fourQuarterNumbers.q2?.home?.[colIndex]}</span>
                              <span className="flex items-center justify-center font-bold text-blue-400 bg-gray-800 rounded-sm">{fourQuarterNumbers.q3?.home?.[colIndex]}</span>
                              <span className="flex items-center justify-center font-bold text-purple-400 bg-gray-800 rounded-sm">{fourQuarterNumbers.q4?.home?.[colIndex]}</span>
                            </div>
                          ) : (
                            <span className="text-lg sm:text-xl">{fullGameNumbers.home?.[colIndex]}</span>
                          )}
                        </div>
                      ))}

                      {/* 3. Away Numbers + 100 Squares */}
                      {Array.from({ length: 10 }).map((_, rowIndex) => (
                          <Fragment key={`row-${rowIndex}`}>
                              {/* Away Number Header - NOW HORIZONTAL INDIVIDUAL SQUARES */}
                              <div className="flex items-center justify-center bg-gray-700 rounded-sm font-bold text-yellow-400 aspect-square p-0.5">
                                  {settings['Game Mode'] === '4 Quarters' ? (
                                    // This is now a grid of 4 horizontal boxes
                                    <div className="grid grid-cols-4 gap-0.5 text-center text-[10px] sm:text-base w-full h-full font-sans-readable">
                                      <span className="flex items-center justify-center font-bold text-orange-400 bg-gray-800 rounded-sm">{fourQuarterNumbers.q1?.away?.[rowIndex]}</span>
                                      <span className="flex items-center justify-center font-bold text-yellow-300 bg-gray-800 rounded-sm">{fourQuarterNumbers.q2?.away?.[rowIndex]}</span>
                                      <span className="flex items-center justify-center font-bold text-blue-400 bg-gray-800 rounded-sm">{fourQuarterNumbers.q3?.away?.[rowIndex]}</span>
                                      <span className="flex items-center justify-center font-bold text-purple-400 bg-gray-800 rounded-sm">{fourQuarterNumbers.q4?.away?.[rowIndex]}</span>
                                    </div>
                                  ) : (
                                    <span className="text-lg sm:text-xl">{fullGameNumbers.away?.[rowIndex]}</span>
                                  )}
                              </div>

                              {/* The 10 Squares for this row */}
                              {Array.from({ length: 10 }).map((_, colIndex) => {
                                  const squareNumber = rowIndex * 10 + colIndex + 1;
                                  const claimed = claimedSquaresMap.get(squareNumber);
                                  const isSelected = selectedSquares.includes(squareNumber);
                                  const winnerClasses = []; const winnerBadges = [];
                                  Object.entries(winningSquares).forEach(([quarter, num]) => { if(num === squareNumber) { if (quarter === 'Q1') { winnerClasses.push('border-orange-500'); winnerBadges.push({q: 'Q1', c: 'bg-orange-500'}); } if (quarter === 'Q2') { winnerClasses.push('border-yellow-400'); winnerBadges.push({q: 'Q2', c: 'bg-yellow-400'}); } if (quarter === 'Q3') { winnerClasses.push('border-blue-500'); winnerBadges.push({q: 'Q3', c: 'bg-blue-500'}); } if (quarter === 'Q4') { winnerClasses.push('border-purple-500'); winnerBadges.push({q: 'F', c: 'bg-purple-500'}); } } });
                                  const borderClass = winnerClasses.length > 0 ? winnerClasses.join(' ') + ' border-4' : isSelected ? 'border-4 border-green-500' : claimed && !claimed.paid ? 'border-2 border-red-500' : 'border-2 border-gray-600';
                                  return (<div key={squareNumber} onClick={() => handleSquareClick(squareNumber)} className={`relative aspect-square flex flex-col items-center justify-center rounded-sm transition-all duration-200 cursor-pointer ${borderClass} ${claimed ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700'}`}><span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] text-gray-500 font-sans-readable">{squareNumber}</span>{claimed && <span className="text-[9px] sm:text-sm font-semibold text-center break-all px-0.5 font-sans-readable">{claimed.initials || claimed.name}</span>}{winnerBadges.length > 0 && <div className="absolute top-0.5 right-0.5 flex flex-col gap-0.5">{winnerBadges.map(b => (<span key={b.q} className={`text-[8px] font-bold px-1 rounded-full text-gray-900 ${b.c}`}>{b.q}</span>))}</div>}</div>);
                              })}
                          </Fragment>
                      ))}
                  </div>
              </div>
            </div>

            {/* This is the existing legend, no changes needed here */}
            <div className="mt-4 bg-gray-800 rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm font-sans-readable">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-gray-600 bg-gray-900"></div><span>Available</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-red-500 bg-gray-700"></div><span>Claimed (Unpaid)</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-orange-500 bg-gray-700"></div><span>Q1 Winner</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-yellow-400 bg-gray-700"></div><span>Q2 Winner</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-blue-500 bg-gray-700"></div><span>Q3 Winner</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-purple-500 bg-gray-700"></div><span>Final Winner</span></div>
            </div>
          </div>
          <div className="lg:w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg font-sans-readable">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400 font-russo">Claim Your Squares</h2>
            <form onSubmit={handleClaimSubmit}>
              <div className="mb-4"><label className="block text-gray-400 mb-2" htmlFor="name">Your Name</label><input type="text" id="name" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400"/></div>
              <div className="mb-4"><label className="block text-gray-400 mb-2" htmlFor="initials">Your Initials (Max 3)</label><input type="text" id="initials" value={formInitials} onChange={(e) => setFormInitials(e.target.value.toUpperCase().slice(0, 3))} maxLength={3} className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400"/></div>
              <div className="mb-4"><label className="block text-gray-400 mb-2">Selected Squares ({selectedSquares.length})</label><div className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 min-h-[44px] break-words">{selectedSquares.length > 0 ? selectedSquares.sort((a,b) => a - b).join(', ') : <span className="text-gray-500">Click squares on the grid</span>}</div></div>
              <div className="flex gap-2 mb-4"><input type="number" placeholder="#" value={numToRandomize} onChange={e => setNumToRandomize(e.target.value)} className="w-1/3 bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400 text-center" min="1"/><button type="button" onClick={handleRandomizeSelection} className="w-2/3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 font-russo"><Dice5Icon/> Pick Random</button></div>
              <div className="mb-4"><label className="block text-gray-400 mb-2" htmlFor="payment">Payment Method</label><select id="payment" value={formPaymentMethod} onChange={e => setFormPaymentMethod(e.target.value)} className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400">{paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
              {settings[`${formPaymentMethod} Account`] && (
                <div className="mb-4 -mt-2 text-center bg-gray-700 p-2 rounded-lg">
                    <p className="text-sm text-gray-400">Send payment to:</p>
                    <p className="font-bold text-yellow-300">{settings[`${formPaymentMethod} Account`]}</p>
                </div>
              )}
              <div className="bg-gray-900 rounded-lg p-4 text-center mb-4 font-russo"><p className="text-gray-400">Total Cost</p><p className="text-3xl font-bold text-green-400">${selectedSquares.length * settings['Cost Per Square']}</p></div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 font-russo flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? <RefreshCwIcon className="animate-spin h-6 w-6" /> : 'Claim Squares'}
              </button>
            </form>
          </div>
        </main>
        {showAdminPanel && (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4"><div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative font-sans-readable">
            <button onClick={() => setShowAdminPanel(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button><h2 className="text-2xl font-bold mb-4 text-center text-yellow-400 font-russo">Admin Panel</h2>
            {!isAdmin ? (<form onSubmit={handleAdminLogin} className="flex flex-col items-center"><label className="text-gray-400 mb-2" htmlFor="admin-pass">Enter Admin Password</label><input type="password" id="admin-pass" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 mb-4 w-64 focus:outline-none focus:border-yellow-400"/><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg font-russo">Login</button></form>)
            : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><UserIcon/> Player Payments</h3><div className="space-y-2 max-h-96 overflow-y-auto pr-2">{players.map(player => (<div key={player.Name} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"><div><p className="font-bold">{player.Name} ({player.Initials})</p><p className="text-sm text-gray-400">{String(player.Squares).split(',').length} squares - ${player.Cost} ({player.PaymentMethod})</p></div><div className="flex items-center gap-3"><button onClick={() => handleMarkAsPaid(player.Name, 'Yes')} className={`p-1 rounded-full ${player.Paid === 'Yes' ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-green-600'}`}><CheckCircleIcon/></button><button onClick={() => handleMarkAsPaid(player.Name, 'No')} className={`p-1 rounded-full ${player.Paid === 'No' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-red-600'}`}><XCircleIcon/></button><button onClick={() => handleDeletePlayer(player.Name)} className="p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white"><Trash2Icon/></button></div></div>))}</div></div>
                <div className="space-y-6">
                <div><h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><SlidersIcon/> Game Settings</h3><div className="flex gap-4"><select value={settings['Game Mode']} onChange={handleGameModeChange} className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400"><option value="4 Quarters">4 Quarters</option><option value="Full Game">Full Game</option></select></div></div>
                <div><h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><Dice5Icon/> Randomize Numbers</h3><div className="flex gap-4"><button onClick={() => handleRandomizeNumbers('Full Game')} disabled={claimedSquaresMap.size < 100} title={claimedSquaresMap.size < 100 ? 'All squares must be claimed first' : 'Randomize numbers for full game'} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg font-russo disabled:opacity-50 disabled:cursor-not-allowed">Full Game</button><button onClick={() => handleRandomizeNumbers('4 Quarters')} disabled={claimedSquaresMap.size < 100} title={claimedSquaresMap.size < 100 ? 'All squares must be claimed first' : 'Randomize numbers for 4 quarters'} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg font-russo disabled:opacity-50 disabled:cursor-not-allowed">4 Quarters</button></div></div>
                <div><h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><TrophyIcon/> Enter & Update Scores</h3><div className="space-y-2">{localScores.map(score => (<div key={score.Quarter} className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-2"><label className="font-bold">{score.Quarter === 'Q4' ? 'Final' : score.Quarter}</label><input type="number" placeholder={settings['Away Team Name']} value={score['Away Score']} onChange={(e) => handleLocalScoreChange(score.Quarter, 'Away Score', e.target.value)} className="w-full bg-gray-700 border-2 text-center border-gray-600 rounded-lg p-1"/><input type="number" placeholder={settings['Home Score']} value={score['Home Score']} onChange={(e) => handleLocalScoreChange(score.Quarter, 'Home Score', e.target.value)} className="w-full bg-gray-700 border-2 text-center border-gray-600 rounded-lg p-1"/><button onClick={() => handleScoreUpdate(score.Quarter)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-sm">Save</button></div>))}</div></div>
                <div className="border-t border-gray-700 pt-4"><h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><AlertTriangleIcon className="text-red-500"/> New Game</h3><button onClick={handleNewGame} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg font-russo">Clear All Data</button><p className="text-xs text-gray-400 mt-2">Deletes all players, scores, and numbers. Settings will be kept.</p></div>
            </div></div>)}
        </div></div>)}
        {toast.show && (<div className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg text-white shadow-lg z-50 animate-fade-in-out font-sans-readable`}><span dangerouslySetInnerHTML={{ __html: toast.message }}></span></div>)}
      </div>
    </div>
  );
}

