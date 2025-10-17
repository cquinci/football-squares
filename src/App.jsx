import React, { useState, useMemo, useCallback, useEffect, Fragment } from 'react';

// --- CONFIGURATION --- //
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwjxs9aRHGiqel9Fj2rxiS7Bq2P5Fnj817K7sHjefHPu25ZqahAzTqxA-wqKq44yQ8BOg/exec';

// --- HELPER ICONS --- //
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const RefreshCwIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
const Dice5Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M12 12h.01"></path><path d="M16 16h.01"></path><path d="M8 16h.01"></path></svg>;
const TrophyIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432L12.586 2.586z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>;

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

  // UI State
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [formName, setFormName] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('');
  const [numToRandomize, setNumToRandomize] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localScores, setLocalScores] = useState([]);

  // --- DATA FETCHING & SYNCING --- //
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    showToast('Syncing with Google Sheet...', 'info');
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
      showToast('Data synced!', 'success');
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- DERIVED STATE & MEMOIZATION --- //
  const claimedSquaresMap = useMemo(() => {
    const map = new Map();
    players.forEach(player => {
      if (player.Squares) {
        String(player.Squares).split(',').forEach(numStr => {
          if (numStr.trim() !== '') {
             map.set(parseInt(numStr.trim(), 10), { name: player.Name, paid: player.Paid === 'Yes' });
          }
        });
      }
    });
    return map;
  }, [players]);

  const winningSquares = useMemo(() => {
    const winners = {};
    if (!scores || !settings) return winners;
    const scoresToProcess = settings['Game Mode'] === 'Full Game' ? scores.filter(s => s.Quarter === 'Q4') : scores;
    scoresToProcess.forEach(({ Quarter, 'Home Score': homeScore, 'Away Score': awayScore }) => {
      if (homeScore === '' || awayScore === '' || homeScore === undefined || awayScore === undefined) return;
      const homeDigit = parseInt(String(homeScore).slice(-1), 10);
      const awayDigit = parseInt(String(awayScore).slice(-1), 10);
      const numbers = settings['Game Mode'] === '4 Quarters' ? fourQuarterNumbers[Quarter.toLowerCase()] : fullGameNumbers;
      if (!numbers || !numbers.home || !numbers.home.length === 0) return;
      const homeIndex = numbers.home.indexOf(homeDigit);
      const awayIndex = numbers.away.indexOf(awayDigit);
      if (homeIndex !== -1 && awayIndex !== -1) {
        winners[Quarter] = awayIndex * 10 + homeIndex + 1;
      }
    });
    return winners;
  }, [scores, settings, fullGameNumbers, fourQuarterNumbers]);
  
  const paymentMethods = useMemo(() => (settings['Payment Methods'] || '').split(','), [settings]);
  
  // --- GENERAL FUNCTIONS --- //
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
    if (!formName.trim() || selectedSquares.length === 0) {
      showToast('Please enter your name and select at least one square.', 'error'); return;
    }
    const payload = {
      action: 'claimSquare',
      payload: { Name: formName, Squares: selectedSquares.join(','), PaymentMethod: formPaymentMethod, Cost: selectedSquares.length * settings['Cost Per Square'] }
    };
    try {
      showToast('Submitting your claim...', 'info');
      const response = await fetch(API_BASE_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message);
      showToast('Success! Squares claimed.', 'success');
      setFormName('');
      setSelectedSquares([]);
      fetchData();
    } catch (error) {
      console.error("Failed to claim squares:", error);
      showToast(`Error: ${error.message}`, 'error');
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
      fetchData(); // Refresh data after any successful admin action
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
  
  const handleRandomizeNumbers = (mode) => {
    postAdminAction('randomizeNumbers', { mode });
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

  // --- RENDER --- //
  if (isLoading) {
      return (<div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center"><RefreshCwIcon className="animate-spin h-12 w-12 mb-4"/><p className="text-xl">Loading Super Bowl Board...</p></div>);
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4"><img src={settings['Away Team Logo URL']} alt={settings['Away Team Name']} className="h-10 w-10 sm:h-12 sm:w-12 object-contain"/><span className="text-lg sm:text-2xl font-bold text-gray-300">{settings['Away Team Name']}</span></div>
            <div className="text-center"><h1 className="text-2xl sm:text-4xl font-bold text-yellow-400 tracking-wider">{settings['Title'] || 'Super Bowl Squares'}</h1><span className="text-sm text-gray-400">{new Date().getFullYear()}</span></div>
            <div className="flex items-center gap-4"><span className="text-lg sm:text-2xl font-bold text-gray-300">{settings['Home Team Name']}</span><img src={settings['Home Team Logo URL']} alt={settings['Home Team Name']} className="h-10 w-10 sm:h-12 sm:w-12 object-contain"/></div>
        </header>

        <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg flex flex-col sm:flex-row items-center justify-around text-center gap-4">
            <div className="flex flex-col">
                <span className="text-sm text-gray-400">Total Pot</span>
                <span className="text-3xl font-bold text-green-400">${claimedSquaresMap.size * (settings['Cost Per Square'] || 0)}</span>
            </div>
            <div className="h-16 w-px bg-gray-600 hidden sm:block"></div>
            <div className="flex items-center gap-4 sm:gap-6 text-lg">
                <TrophyIcon className="text-yellow-400 h-8 w-8"/>
                <div className="text-left">
                    <p><span className="font-bold text-orange-400">Q1:</span> ${settings['Payout Q1'] || '0'}</p>
                    <p><span className="font-bold text-yellow-300">Q2:</span> ${settings['Payout Q2'] || '0'}</p>
                </div>
                <div className="text-left">
                    <p><span className="font-bold text-blue-400">Q3:</span> ${settings['Payout Q3'] || '0'}</p>
                    <p><span className="font-bold text-purple-400">Final:</span> ${settings['Payout Final'] || '0'}</p>
                </div>
            </div>
        </div>
        
        <div className="flex justify-between items-center mb-4 px-2">
            <button onClick={fetchData} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 disabled:opacity-50"><RefreshCwIcon className={isRefreshing ? 'animate-spin' : ''}/><span className="hidden sm:inline">Sync Data</span></button>
            <div className="flex items-center gap-2 text-lg font-bold bg-gray-800 px-4 py-2 rounded-lg"><TagIcon/><span>Cost per Square:</span><span className="text-yellow-400">${settings['Cost Per Square']}</span></div>
            <button onClick={() => setShowAdminPanel(!showAdminPanel)} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-transform transform hover:scale-105"><LockIcon/><span className="hidden sm:inline">Admin</span></button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-2 sm:p-4 rounded-xl shadow-2xl relative overflow-x-auto">
                <div className="grid grid-cols-11 gap-1 min-w-[800px] md:min-w-full">
                    <div className="relative aspect-square bg-gray-700 rounded-md font-bold text-white text-xs overflow-hidden">
                        {settings['Game Mode'] === '4 Quarters' && (<>
                            <div className="absolute top-0 left-0 w-full h-full border-r border-b border-gray-600 flex items-center justify-center"><span className="text-orange-400">Q1</span></div>
                            <div className="absolute top-[25%] left-[25%] w-[75%] h-[75%] border-r border-b border-gray-600 flex items-center justify-center"><span className="text-yellow-300" style={{transform: 'translate(-16.7%, -16.7%)'}}>Q2</span></div>
                            <div className="absolute top-[50%] left-[50%] w-[50%] h-[50%] border-r border-b border-gray-600 flex items-center justify-center"><span className="text-blue-400" style={{transform: 'translate(-25%, -25%)'}}>Q3</span></div>
                            <div className="absolute top-[75%] left-[75%] w-[25%] h-[25%] flex items-center justify-center"><span className="text-purple-400" style={{transform: 'translate(-50%, -50%)'}}>F</span></div>
                        </>)}
                    </div>
                    {Array.from({ length: 10 }).map((_, colIndex) => (<div key={`home-header-${colIndex}`} className="flex items-center justify-center bg-gray-700 rounded-md font-bold text-yellow-400 aspect-square p-0.5">{settings['Game Mode'] === '4 Quarters' ? (<div className="grid grid-rows-4 text-center text-base w-full h-full"><span className="flex items-center justify-center font-bold text-orange-400 border-b border-gray-500">{fourQuarterNumbers.q1?.home?.[colIndex]}</span><span className="flex items-center justify-center font-bold text-yellow-300 border-b border-gray-500">{fourQuarterNumbers.q2?.home?.[colIndex]}</span><span className="flex items-center justify-center font-bold text-blue-400 border-b border-gray-500">{fourQuarterNumbers.q3?.home?.[colIndex]}</span><span className="flex items-center justify-center font-bold text-purple-400">{fourQuarterNumbers.q4?.home?.[colIndex]}</span></div>) : (<span className="text-xl">{fullGameNumbers.home?.[colIndex]}</span>)}</div>))}
                    {Array.from({ length: 10 }).map((_, rowIndex) => (<React.Fragment key={`row-${rowIndex}`}>
                        <div className="flex items-center justify-center bg-gray-700 rounded-md font-bold text-yellow-400 aspect-square p-0.5">{settings['Game Mode'] === '4 Quarters' ? (<div className="grid grid-cols-4 text-center text-base w-full h-full"><span className="flex flex-col items-center justify-center font-bold text-orange-400 border-r border-gray-500">{fourQuarterNumbers.q1?.away?.[rowIndex]}</span><span className="flex flex-col items-center justify-center font-bold text-yellow-300 border-r border-gray-500">{fourQuarterNumbers.q2?.away?.[rowIndex]}</span><span className="flex flex-col items-center justify-center font-bold text-blue-400 border-r border-gray-500">{fourQuarterNumbers.q3?.away?.[rowIndex]}</span><span className="flex flex-col items-center justify-center font-bold text-purple-400">{fourQuarterNumbers.q4?.away?.[rowIndex]}</span></div>) : (<span className="text-xl">{fullGameNumbers.away?.[rowIndex]}</span>)}</div>
                        {Array.from({ length: 10 }).map((_, colIndex) => {
                            const squareNumber = rowIndex * 10 + colIndex + 1;
                            const claimed = claimedSquaresMap.get(squareNumber);
                            const isSelected = selectedSquares.includes(squareNumber);
                            const winnerClasses = []; const winnerBadges = [];
                            Object.entries(winningSquares).forEach(([quarter, num]) => { if(num === squareNumber) { if (quarter === 'Q1') { winnerClasses.push('border-orange-500'); winnerBadges.push({q: 'Q1', c: 'bg-orange-500'}); } if (quarter === 'Q2') { winnerClasses.push('border-yellow-400'); winnerBadges.push({q: 'Q2', c: 'bg-yellow-400'}); } if (quarter === 'Q3') { winnerClasses.push('border-blue-500'); winnerBadges.push({q: 'Q3', c: 'bg-blue-500'}); } if (quarter === 'Q4') { winnerClasses.push('border-purple-500'); winnerBadges.push({q: 'F', c: 'bg-purple-500'}); } } });
                            const borderClass = winnerClasses.length > 0 ? winnerClasses.join(' ') + ' border-4' : isSelected ? 'border-4 border-green-500' : claimed && !claimed.paid ? 'border-2 border-red-500' : 'border-2 border-gray-600';
                            return (<div key={squareNumber} onClick={() => handleSquareClick(squareNumber)} className={`relative aspect-square flex flex-col items-center justify-center rounded-md transition-all duration-200 cursor-pointer ${borderClass} ${claimed ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700'}`}><span className="absolute top-1 left-1 text-xs text-gray-500">{squareNumber}</span>{claimed && <span className="text-sm sm:text-base font-semibold text-center break-all px-1">{claimed.name}</span>}{winnerBadges.length > 0 && <div className="absolute top-1 right-1 flex flex-col gap-0.5">{winnerBadges.map(b => (<span key={b.q} className={`text-[8px] font-bold px-1 rounded-full text-gray-900 ${b.c}`}>{b.q}</span>))}</div>}</div>);
                        })}
                    </React.Fragment>))}
                </div>
            </div>
            <div className="mt-4 bg-gray-800 rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-gray-600 bg-gray-900"></div><span>Available</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-red-500 bg-gray-700"></div><span>Claimed (Unpaid)</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-orange-500 bg-gray-700"></div><span>Q1 Winner</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-yellow-400 bg-gray-700"></div><span>Q2 Winner</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-blue-500 bg-gray-700"></div><span>Q3 Winner</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-4 border-purple-500 bg-gray-700"></div><span>Final Winner</span></div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">Claim Your Squares</h2>
            <form onSubmit={handleClaimSubmit}>
              <div className="mb-4"><label className="block text-gray-400 mb-2" htmlFor="name">Your Name</label><input type="text" id="name" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400"/></div>
              <div className="mb-4"><label className="block text-gray-400 mb-2">Selected Squares ({selectedSquares.length})</label><div className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 min-h-[44px] break-words">{selectedSquares.length > 0 ? selectedSquares.sort((a,b) => a - b).join(', ') : <span className="text-gray-500">Click squares on the grid</span>}</div></div>
              <div className="flex gap-2 mb-4"><input type="number" value={numToRandomize} onChange={e => setNumToRandomize(Math.max(1, parseInt(e.target.value) || 1))} className="w-1/3 bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400 text-center" min="1"/><button type="button" onClick={handleRandomizeSelection} className="w-2/3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"><Dice5Icon/> Pick Random</button></div>
              <div className="mb-4"><label className="block text-gray-400 mb-2" htmlFor="payment">Payment Method</label><select id="payment" value={formPaymentMethod} onChange={e => setFormPaymentMethod(e.target.value)} className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:border-yellow-400">{paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
              <div className="bg-gray-900 rounded-lg p-4 text-center mb-4"><p className="text-gray-400">Total Cost</p><p className="text-3xl font-bold text-green-400">${selectedSquares.length * settings['Cost Per Square']}</p></div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105">Claim Squares</button>
            </form>
          </div>
        </main>
        {showAdminPanel && (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"><div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowAdminPanel(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button><h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">Admin Panel</h2>
            {!isAdmin ? (<form onSubmit={handleAdminLogin} className="flex flex-col items-center"><label className="text-gray-400 mb-2" htmlFor="admin-pass">Enter Admin Password</label><input type="password" id="admin-pass" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="bg-gray-700 border-2 border-gray-600 rounded-lg p-2 mb-4 w-64 focus:outline-none focus:border-yellow-400"/><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Login</button></form>)
            : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><h3 className="text-xl font-bold mb-3 flex items-center gap-2"><UserIcon/> Player Payments</h3><div className="space-y-2 max-h-96 overflow-y-auto pr-2">{players.map(player => (<div key={player.Name} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"><div><p className="font-bold">{player.Name}</p><p className="text-sm text-gray-400">{String(player.Squares).split(',').length} squares - ${player.Cost} ({player.PaymentMethod})</p></div><div className="flex items-center gap-2"><button onClick={() => handleMarkAsPaid(player.Name, 'Yes')} className={`p-1 rounded-full ${player.Paid === 'Yes' ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-green-600'}`}><CheckCircleIcon/></button><button onClick={() => handleMarkAsPaid(player.Name, 'No')} className={`p-1 rounded-full ${player.Paid === 'No' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-red-600'}`}><XCircleIcon/></button></div></div>))}</div></div>
                <div className="space-y-6"><div><h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Dice5Icon/> Randomize Numbers</h3><div className="flex gap-4"><button onClick={() => handleRandomizeNumbers('Full Game')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Full Game</button><button onClick={() => handleRandomizeNumbers('4 Quarters')} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">4 Quarters</button></div><p className="text-sm text-gray-400 mt-2">Current Mode: <span className="font-bold">{settings['Game Mode']}</span></p></div>
                <div><h3 className="text-xl font-bold mb-3 flex items-center gap-2"><TrophyIcon/> Enter & Update Scores</h3><div className="space-y-2">{localScores.map(score => (<div key={score.Quarter} className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-2"><label className="font-bold">{score.Quarter === 'Q4' ? 'Final' : score.Quarter}</label><input type="number" placeholder={settings['Away Team Name']} value={score['Away Score']} onChange={(e) => handleLocalScoreChange(score.Quarter, 'Away Score', e.target.value)} className="w-full bg-gray-700 border-2 text-center border-gray-600 rounded-lg p-1"/><input type="number" placeholder={settings['Home Team Name']} value={score['Home Score']} onChange={(e) => handleLocalScoreChange(score.Quarter, 'Home Score', e.target.value)} className="w-full bg-gray-700 border-2 text-center border-gray-600 rounded-lg p-1"/><button onClick={() => handleScoreUpdate(score.Quarter)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-sm">Save</button></div>))}</div></div>
            </div></div>)}
        </div></div>)}
        {toast.show && (<div className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg text-white shadow-lg z-50 animate-fade-in-out ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>{toast.message}</div>)}
      </div>
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `@keyframes fade-in-out {0% { opacity: 0; transform: translateY(20px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(20px); } } .animate-fade-in-out { animation: fade-in-out 3s ease-in-out; }`;
document.head.appendChild(style);

