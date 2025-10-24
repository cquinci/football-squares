import React, { useState, useMemo, useCallback, useEffect, Fragment, useRef } from 'react'; // Added useRef

// --- CONFIGURATION --- //
// UPDATED API URL:
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxktTwBcumfssA3YPL93UMwtrfZccGpEFA_olmHTfJj63UeRPYlERKNPfkvWExA9-YioA/exec';

// --- HELPER ICONS --- //
// Adjusted icons to use currentColor for better theme compatibility
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
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
// Sun/Moon icons for theme toggle
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;


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
  const [theme, setTheme] = useState('dark'); // Theme state ('light' or 'dark')

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
  const [isRefreshing, setIsRefreshing] = useState(false); // Only for visual indicator
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [localScores, setLocalScores] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Admin Panel State
  const [localSettings, setLocalSettings] = useState({}); 
  const [editingPlayer, setEditingPlayer] = useState(null); 

  // --- REFS --- //
  const isFetchingRef = useRef(false); // Ref to prevent simultaneous fetches
  const toastTimerRef = useRef(null); // Ref to manage toast timeout

  // --- TOAST FUNCTION --- // 
  const showToast = useCallback((message, type = 'success') => {
    // Clear existing timer if any
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const displayMessage = typeof message === 'string' ? message : JSON.stringify(message);
    setToast({ show: true, message: displayMessage, type });
    // Set new timer
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => prev.show ? { show: false, message: '', type: 'success' } : prev); 
    }, 3000);
  }, []); // No dependencies needed

  
  // --- DERIVED STATE & MEMOIZATION (MOVED UP) --- //
  const totalPot = useMemo(() => {
    const cost = Number(isAdmin ? localSettings['Cost Per Square'] : settings['Cost Per Square']) || 0;
    return cost * 100; 
  }, [settings, localSettings, isAdmin]);

  const claimedSquaresMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(players)) { 
        players.forEach(player => {
        if (player && player.Squares) {
            String(player.Squares).split(',').forEach(numStr => {
            const trimmedNumStr = numStr.trim();
            if (trimmedNumStr !== '') {
                const num = parseInt(trimmedNumStr, 10);
                if (!isNaN(num)) {
                    map.set(num, { 
                        name: player.Name || '', 
                        initials: player.Initials || '', 
                        paid: player.Paid === 'Yes' 
                    });
                }
            }
            });
        }
        });
    }
    return map;
  }, [players]);

  const adminStats = useMemo(() => {
    const totalClaimed = claimedSquaresMap.size;
    const totalAvailable = 100 - totalClaimed;
    const validPlayers = Array.isArray(players) ? players.filter(p => p) : []; 
    const totalPaid = validPlayers.filter(p => p.Paid === 'Yes').length; 
    const totalUnpaid = validPlayers.filter(p => p.Paid !== 'Yes').length; 
    return { totalClaimed, totalAvailable, totalPaid, totalUnpaid };
  }, [claimedSquaresMap, players]);

  const winningSquares = useMemo(() => {
    const winners = {};
    if (!Array.isArray(scores) || !settings) { 
      return winners;
    }

    scores.forEach(score => {
        if (!score || !score.Quarter) return; 

        const { Quarter, 'Home Score': homeScore, 'Away Score': awayScore } = score;

        const isHomeScoreValid = homeScore === '' || (homeScore !== undefined && homeScore !== null && !isNaN(Number(homeScore)));
        const isAwayScoreValid = awayScore === '' || (awayScore !== undefined && awayScore !== null && !isNaN(Number(awayScore)));

        if (!isHomeScoreValid || !isAwayScoreValid) {
            console.warn("Invalid score found:", score); 
            return; 
        }
        
        const homeDigit = homeScore === '' ? null : parseInt(String(homeScore).slice(-1), 10);
        const awayDigit = awayScore === '' ? null : parseInt(String(awayScore).slice(-1), 10);

        if (homeDigit === null || isNaN(homeDigit) || awayDigit === null || isNaN(awayDigit)) {
             return; 
        }

        let numbers;
        const gameMode = settings?.['Game Mode']; 

        if (gameMode === 'Full Game') {
            numbers = fullGameNumbers;
        } else if (gameMode === '4 Quarters') { 
             const quarterKey = String(Quarter).toLowerCase(); 
             if (fourQuarterNumbers && fourQuarterNumbers[quarterKey]) { 
                 numbers = fourQuarterNumbers[quarterKey];
             } else {
                 console.warn(`Number data for quarter ${quarterKey} not found.`);
                 numbers = null; 
             }
        } else {
             numbers = null; 
        }

        if (numbers && numbers.home && Array.isArray(numbers.home) && numbers.home.length > 0 && 
            numbers.away && Array.isArray(numbers.away) && numbers.away.length > 0) {
            
            const homeIndex = numbers.home.indexOf(homeDigit);
            const awayIndex = numbers.away.indexOf(awayDigit);

            if (homeIndex !== -1 && awayIndex !== -1) {
                 winners[Quarter] = awayIndex * 10 + homeIndex + 1;
            }
        }
    });

    return winners;
  }, [scores, settings, fullGameNumbers, fourQuarterNumbers]);
  
  const paymentMethods = useMemo(() => (settings?.['Payment Methods'] || '').split(',').map(m => m.trim()).filter(Boolean), [settings]); 


  const calculatePayoutAmount = useCallback((percentKey) => {
    // Ensure localSettings is populated before calculating
    if (!localSettings || Object.keys(localSettings).length === 0) return 0; 
    const percent = Number(localSettings[percentKey]) || 0;
    const calculated = totalPot > 0 ? Math.round((percent / 100) * totalPot) : 0;
    return calculated;
  }, [localSettings, totalPot]);


  // --- DATA FETCHING --- //
  const fetchData = useCallback(async (isInitialLoad = false) => {
    // Prevent simultaneous fetches
    if (isFetchingRef.current) {
        return;
    }
    isFetchingRef.current = true; 
    setIsRefreshing(true); // Indicate visual refresh start
    // Only show "Syncing" toast for manual refreshes (not initial load)
    if (!isInitialLoad) showToast('Syncing with Google Sheet...', 'info'); 

    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        let errorText = `Network response was not ok: ${response.statusText} (${response.status})`;
        try { 
            const text = await response.text(); 
            if (text.includes('<title>Error</title>') || text.includes('Google Apps Script has completed') || text.includes('script function not found')) {
                 errorText = "Backend script error. Check Google Apps Script logs/deployment."; 
            }
        } catch(e) {/* Ignore if reading text fails */}
        throw new Error(errorText);
      }
      
      const contentType = response.headers.get("content-type");
       // Allow text/javascript as well, as GAS sometimes returns this
      if (!contentType || !(contentType.includes("application/json") || contentType.includes("text/javascript"))) {
         const textResponse = await response.text();
         console.error("Non-JSON response received:", textResponse);
         throw new Error("Received non-JSON response from server. Check Apps Script logs.");
      }
      const data = await response.json();
      
      if (data.error) {
        if (data.error.includes("Spreadsheet ID")) throw new Error("Spreadsheet ID Error"); 
        if (data.error.includes("Too many simultaneous invocations")) throw new Error("Too many simultaneous invocations");
        throw new Error(data.error); 
      }
      
      const fetchedSettings = data.settings || {};
      setPlayers(data.players || []);
      setSettings(fetchedSettings); 

      // Initialize localSettings based on fetchedSettings ONLY on initial load
      if (isInitialLoad) {
        const initialLocalSettings = { ...fetchedSettings };
        const cost = Number(fetchedSettings['Cost Per Square']) || 0;
        const currentTotalPot = cost * 100;
        ['Payout Q1', 'Payout Q2', 'Payout Q3', 'Payout Final'].forEach(key => {
            const percentKey = `${key} Percent`;
            const existingPercent = fetchedSettings[percentKey];
            if (existingPercent !== undefined && existingPercent !== '') {
                initialLocalSettings[percentKey] = Number(existingPercent) || 0;
                initialLocalSettings[key] = Math.round((initialLocalSettings[percentKey] / 100) * currentTotalPot);
            }
            else {
                const amount = Number(initialLocalSettings[key]) || 0;
                initialLocalSettings[percentKey] = currentTotalPot > 0 ? Math.round((amount / currentTotalPot) * 100) : 0;
                initialLocalSettings[key] = amount;
            }
        });
        setLocalSettings(initialLocalSettings); 
      }
      
      setScores(data.scores || []);
      setLocalScores(data.scores || []); 
      setFullGameNumbers(data.fullGameNumbers || { home: [], away: [] });
      setFourQuarterNumbers(data.fourQuarterNumbers || { q1: {}, q2: {}, q3: {}, q4: {} });
      
      // Logic to set default payment method moved to its own useEffect
      
      if (!isInitialLoad) showToast('Data synced!', 'success'); 

    } catch (error) {
      console.error("Failed to fetch data:", error); 
      let errorMessage = `Error fetching data: ${error.message}`;
      if (error.message === "Spreadsheet ID Error") errorMessage = "<b>Backend Error:</b> Your Spreadsheet ID is missing or incorrect in the Google Apps Script. Please update it and re-deploy.";
      else if (error.message.includes("Network response") || error.message.includes("Failed to fetch")) errorMessage = "<b>Network Error:</b> Could not connect to the Google Sheet backend. Check your internet connection or the Apps Script URL.";
      else if (error.message.includes("Too many simultaneous invocations")) errorMessage = "<b>Backend Busy:</b> The server is busy, please wait a moment and try syncing again.";
      else if (error.message.includes("non-JSON response") || error.message.includes("Backend script error")) errorMessage = "<b>Backend Error:</b> Received an unexpected response from the server. Check Google Apps Script logs for errors.";
      
      if (isInitialLoad) setStartupError(errorMessage); 
      showToast(errorMessage, 'error'); 

    } finally {
      if (isInitialLoad) setIsLoading(false); 
      setIsRefreshing(false); // Visual indicator stops
      isFetchingRef.current = false; // Allow next fetch
    }
  }, [API_BASE_URL, showToast]); // Removed formPaymentMethod


  // --- FONT LOADING & INITIAL FETCH --- //
  useEffect(() => {
    // Add Fonts & Styles
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    const style = document.createElement('style');
     // Inject Tailwind dark mode class based on state
    style.textContent = `
      :root { --toast-bg: #1f2937; --toast-text: #f9fafb; } /* Default dark theme vars */
      html.light { --toast-bg: #f3f4f6; --toast-text: #11182b; } /* Light theme vars */
      body, .font-russo { font-family: 'Russo One', sans-serif; }
      .font-sans-readable { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
      @keyframes roll { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .animate-roll { animation: roll 0.5s linear infinite; }
      .writing-mode-v-rl { writing-mode: vertical-rl; }
      .no-select { user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }
      .grid-cell-min-width { min-width: 1.5rem; } 
    `;
    document.head.appendChild(style);
    
    // Initial Fetch
    fetchData(true); 

    // Cleanup toast timer on unmount
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  // --- FIX: Removed fetchData from dependency array to break loop/fix error ---
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount
  // --- END FIX ---

   // --- THEME MANAGEMENT --- //
   useEffect(() => {
     // Apply the theme class to the html element
     const root = window.document.documentElement;
     root.classList.remove(theme === 'light' ? 'dark' : 'light');
     root.classList.add(theme);
   }, [theme]);
   
   // --- useEffect to set default payment method ---
   useEffect(() => {
       // Only run if settings are loaded
       if (Object.keys(settings).length > 0) { 
           const paymentMethodsString = settings?.['Payment Methods'] || '';
           const currentMethods = paymentMethodsString.split(',').map(m => m.trim()).filter(Boolean);
           // Only set if current method is blank or not in the valid list
           if (!formPaymentMethod || !currentMethods.includes(formPaymentMethod)) {
               setFormPaymentMethod(currentMethods[0] || ''); 
           }
       }
   // Run this when settings load, or if formPaymentMethod somehow gets reset
   }, [settings, formPaymentMethod]); 
   // --- END useEffect ---


   // Function to toggle theme
   const toggleTheme = () => {
       setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
   };
   // --- END THEME MANAGEMENT --- //


  // --- ADMIN PANEL LOCAL SETTINGS RESET --- //
  useEffect(() => {
    // Only reset localSettings when the panel becomes visible AND admin is logged in
    if (showAdminPanel && isAdmin) {
      const currentSettings = { ...settings }; 
      const cost = Number(currentSettings['Cost Per Square']) || 0;
      const currentTotalPot = cost * 100;
       ['Payout Q1', 'Payout Q2', 'Payout Q3', 'Payout Final'].forEach(key => {
           const percentKey = `${key} Percent`;
           const existingPercent = currentSettings[percentKey];
           if (existingPercent !== undefined && existingPercent !== '') {
               currentSettings[percentKey] = Number(existingPercent) || 0;
               currentSettings[key] = Math.round((currentSettings[percentKey] / 100) * currentTotalPot);
           }
           else {
               const amount = Number(currentSettings[key]) || 0;
               currentSettings[percentKey] = currentTotalPot > 0 ? Math.round((amount / currentTotalPot) * 100) : 0;
               currentSettings[key] = amount;
           }
       });
       setLocalSettings(currentSettings);
    }
    // Dependency array ensures this runs when panel opens or settings data updates
  }, [showAdminPanel, isAdmin, settings]); 
    
  
  // --- GENERAL FUNCTIONS (MOVED AFTER MEMOS) --- //
  
  const handleSquareClick = useCallback((squareNumber) => {
    if (claimedSquaresMap.has(squareNumber)) {
      showToast('This square is already taken.', 'error'); return;
    }
    setSelectedSquares(prev => prev.includes(squareNumber) ? prev.filter(s => s !== squareNumber) : [...prev, squareNumber]);
  }, [claimedSquaresMap, showToast]); 

  const handleRandomizeSelection = useCallback(() => { 
    const availableSquares = Array.from({ length: 100 }, (_, i) => i + 1).filter(num => !claimedSquaresMap.has(num));
    const count = parseInt(numToRandomize, 10);
    if (isNaN(count) || count <= 0) { showToast('Please enter a valid number of squares.', 'error'); return; }
    if (availableSquares.length < count) { showToast(`Only ${availableSquares.length} squares are available.`, 'error'); return; }
    
    const shuffledAvailable = availableSquares.sort(() => 0.5 - Math.random());
    setSelectedSquares(shuffledAvailable.slice(0, count));

    showToast(`${count} random square(s) selected.`, 'info');
  }, [numToRandomize, claimedSquaresMap, showToast]); 

  // --- MODIFIED: handleClaimSubmit ---
  const handleClaimSubmit = useCallback(async (e) => { 
    e.preventDefault();
    if (!formName.trim() || !formInitials.trim() || selectedSquares.length === 0) {
      showToast('Please enter your name, initials, and select at least one square.', 'error'); return;
    }
    const costPerSquareValue = Number(settings?.['Cost Per Square']) || 0;
    const totalCost = selectedSquares.length * costPerSquareValue;

    setIsSubmitting(true); 
    const payload = {
      action: 'claimSquare',
      payload: { 
        Name: formName, 
        Initials: formInitials, 
        Squares: selectedSquares.join(','), 
        PaymentMethod: formPaymentMethod, 
        Cost: totalCost 
      }
    };
    try {
      if (isFetchingRef.current) {
          showToast("Sync in progress, please wait...", "warning");
          setIsSubmitting(false); 
          return;
      }
      isFetchingRef.current = true;

      const response = await fetch(API_BASE_URL, { 
          method: 'POST', 
          headers: { 'Content-Type': 'text/plain' }, 
          body: JSON.stringify(payload) 
      });
      
      isFetchingRef.current = false; // Release ref *after* fetch, before processing

      let result;
      let errorMsg = `HTTP error! status: ${response.status}`; // Default error
      
      const textResponse = await response.text(); // Always get text first
      
      try {
           result = JSON.parse(textResponse); // Try to parse as JSON
      } catch (e) {
           // If JSON parse fails, it might be the "raw" error string
           // --- FIX: Check for the specific error text first ---
           if (textResponse.includes("These initials are already used by a different player")) {
               // Extract the user-friendly part of the error
               const match = textResponse.match(/Error: (.*)/); 
               errorMsg = match ? match[1] : "Initials conflict detected.";
               throw new Error(errorMsg); // Throw the specific error
           } else if (textResponse.includes("Could not acquire lock")) {
                errorMsg = "Server busy, please try claiming again shortly.";
                throw new Error(errorMsg); // Throw the specific error
           }
           // --- END FIX ---
           
           console.error("Failed to parse server response:", e);
           if (!response.ok) throw new Error(errorMsg); 
           throw new Error("Failed to parse server response.");
      }


      if (!response.ok) {
        // Use message from JSON if available
        errorMsg = result?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      if (result.status !== 'success') {
          // This will catch {status: 'error', message: '...'}
          throw new Error(result.message || 'Unknown error claiming squares.');
      }
      
      showToast(result.message || 'Success! Squares claimed.', 'success'); 
      setFormName('');
      setFormInitials('');
      setSelectedSquares([]); // This line is correct
      
      await fetchData(false); // Refresh data AFTER success

    } catch (error) {
      console.error("Failed to claim squares:", error);
      // --- FIX: Make check case-insensitive and clean message ---
      const errorMessage = error.message.replace("Server error processing request: ", "");
      const errorMessageLower = errorMessage.toLowerCase();
      
      if (errorMessageLower.includes("initials") && errorMessageLower.includes("already used")) {
           showToast(errorMessage, 'warning'); // Show as a warning
      } else {
           showToast(`Error claiming squares: ${errorMessage}`, 'error'); // Show as error
      }
      // --- END FIX ---
      isFetchingRef.current = false; // Ensure ref is released on error
    } finally {
      setIsSubmitting(false); // Always stop loading indicator
    }
  }, [formName, formInitials, selectedSquares, settings, formPaymentMethod, API_BASE_URL, fetchData, showToast]); 
  // --- END MODIFIED: handleClaimSubmit ---


  const handleAdminLogin = useCallback((e) => { 
    e.preventDefault();
    if(adminPassword === settings?.['Admin Password']) {
      setIsAdmin(true);
      setShowAdminPanel(true); 
      showToast('Admin access granted.', 'success');
    } else {
      showToast('Incorrect password.', 'error');
    }
    setAdminPassword(''); 
  }, [adminPassword, settings, showToast]); 

  // --- ADMIN ACTION FUNCTIONS --- //
  const postAdminAction = useCallback(async (action, payload) => { 
    if (isFetchingRef.current) {
        showToast("Sync in progress, please wait...", "warning");
        return false; 
    }
    isFetchingRef.current = true; 

    try {
      showToast(`Processing: ${action}...`, 'info'); 
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, 
        body: JSON.stringify({ action, payload }),
      });

      isFetchingRef.current = false; // Release ref *after* fetch
       
      let result;
      let errorMsg = `Network error: ${response.status} ${response.statusText}`; // Default error

      try { 
           result = await response.json(); 
           if(!response.ok) {
                errorMsg = result?.message || errorMsg;
           }
      } catch (jsonError) { 
           console.error("Failed to parse JSON response for action:", action, jsonError);
           if (!response.ok) throw new Error(errorMsg); // Throw network error if parse failed
           throw new Error(`Failed to parse response from server for action '${action}'.`); 
      }
       
      if (!response.ok) {
         throw new Error(errorMsg); // Throw error from JSON if available
       }
       
      if (result.status !== 'success') { throw new Error(result.message || `Backend action '${action}' failed.`); }

      showToast(`Success: ${result.message || action + ' completed.'}`, 'success');
      
      // Fetch data AFTER releasing ref and getting success response
      await fetchData(false); 
      
      // Update main settings and localSettings state AFTER successful fetch for settings update
      if (action === 'updateSettings') {
        // Recalculate based on the payload that was *successfully* saved
        const updatedSettings = { ...payload }; 
        const cost = Number(updatedSettings['Cost Per Square']) || 0;
        const pot = cost * 100;
        ['Payout Q1', 'Payout Q2', 'Payout Q3', 'Payout Final'].forEach(key => {
            const percentKey = `${key} Percent`;
            // Ensure both amount and percent are consistent after save
            updatedSettings[key] = Math.round((Number(updatedSettings[percentKey]) / 100) * pot); 
        });
        setSettings(updatedSettings); 
        setLocalSettings(updatedSettings); // Ensure local form reflects saved state
      }
      
      return true; 

    } catch (error) {
      console.error(`Admin action "${action}" failed:`, error);
      // --- FIX: Clean error message before display ---
      const errorMessage = error.message;
      let cleanErrorMessage = errorMessage.replace("Server error processing request: ", "");
      let toastType = 'error'; // Default

      if (errorMessage.includes("Missing required data") || errorMessage.includes("Invalid action") || errorMessage.includes("outdated")) {
          cleanErrorMessage = "Error: Backend script might be outdated or missing data. Please check/update Google Apps Script and re-deploy.";
      } else if (errorMessage.includes("not found")) {
           cleanErrorMessage = `Warning: ${errorMessage}`; 
           toastType = 'warning';
      } else if (errorMessage.includes("Initials") && (errorMessage.includes("already taken") || errorMessage.includes("already used"))) {
           toastType = 'warning';
           // cleanErrorMessage is already set correctly here
      }
      
      showToast(cleanErrorMessage, toastType);
      // --- END FIX ---
      isFetchingRef.current = false; // Ensure ref is reset on error
      return false;
    } finally {
         isFetchingRef.current = false; // Ensure ref is always reset
    }
  }, [API_BASE_URL, fetchData, showToast]); // Dependencies


  const handleMarkAsPaid = useCallback((playerName, status) => { 
    if (!playerName) {
        showToast("Cannot update payment status: Player name is missing.", "error");
        return;
    }
    postAdminAction('markAsPaid', { playerName, status });
  }, [postAdminAction, showToast]); 

  const handleRandomizeNumbers = useCallback(async (mode) => { 
    if (claimedSquaresMap.size < 100) {
        showToast('All 100 squares must be claimed before randomizing.', 'error');
        return;
    }
     setConfirmModal({
        isOpen: true,
        title: `Randomize ${mode}?`,
        message: 'Are you sure you want to randomize the numbers? This will overwrite existing numbers.',
        onConfirm: async () => {
            setIsRandomizing(true); 
            const success = await postAdminAction('randomizeNumbers', { mode });
            setIsRandomizing(false); 
            if (!success) {
                 showToast(`Failed to randomize numbers for ${mode}. Check logs or try again.`, 'error');
            }
        },
         onCancel: () => {} 
    });
  }, [claimedSquaresMap.size, postAdminAction, showToast]); 
  
  const handleLocalScoreChange = useCallback((quarter, team, value) => { 
    if (value === '' || /^\d+$/.test(value)) {
        setLocalScores(prevScores => prevScores.map(s => 
          s && s.Quarter === quarter ? { ...s, [team]: value } : s 
        ));
    } else {
        showToast("Please enter numbers only for scores.", "warning");
    }
  }, [showToast]); 

  const handleScoreUpdate = useCallback((quarter) => { 
    const scoreToUpdate = localScores.find(s => s && s.Quarter === quarter); 
    if (scoreToUpdate) {
      const homeScoreValue = scoreToUpdate['Home Score'] === '' ? '' : Number(scoreToUpdate['Home Score']);
      const awayScoreValue = scoreToUpdate['Away Score'] === '' ? '' : Number(scoreToUpdate['Away Score']);

       if ((scoreToUpdate['Home Score'] !== '' && isNaN(homeScoreValue)) || 
           (scoreToUpdate['Away Score'] !== '' && isNaN(awayScoreValue))) {
           showToast('Invalid score entered. Please enter numbers only.', 'error');
           return;
       }

      postAdminAction('updateScore', { 
        quarter, 
        homeScore: homeScoreValue, 
        awayScore: awayScoreValue 
      });
    } else {
         showToast(`Could not find score data for ${quarter} to update.`, 'error');
    }
  }, [localScores, postAdminAction, showToast]); 

  const handleDeletePlayer = useCallback((playerName) => { 
    if (!playerName) {
        showToast("Cannot delete player: Name is missing.", "error");
        return;
    }
    setConfirmModal({
        isOpen: true,
        title: `Delete ${playerName}?`,
        message: 'This will permanently remove the player and their squares. This action cannot be undone.',
        onConfirm: () => postAdminAction('deletePlayer', { playerName }),
        onCancel: () => {} 
    });
  }, [postAdminAction, showToast]); 

  const handleNewGame = useCallback(() => { 
    setConfirmModal({
        isOpen: true,
        title: 'Start a New Game?',
        message: 'This will delete ALL players, scores, and randomized numbers. Settings will be kept. This action is permanent and cannot be undone.',
        onConfirm: () => postAdminAction('newGame', {}),
        onCancel: () => {} 
    });
  }, [postAdminAction]); 

   // Handler for local settings form input changes (including payouts)
  const handleSettingChange = useCallback((key, value) => {
    setLocalSettings(prev => {
        const updatedSettings = { ...prev };
        updatedSettings[key] = value; 

        // Recalculate derived dollar amounts immediately for display
        const cost = Number(updatedSettings['Cost Per Square']) || 0;
        const pot = cost * 100;

        ['Payout Q1', 'Payout Q2', 'Payout Q3', 'Payout Final'].forEach(amountKey => {
            const percentKey = `${amountKey} Percent`;
            let percent = Number(updatedSettings[percentKey]) || 0;
            
            // If cost or percent changed, update the dollar amount
            if (key === 'Cost Per Square' || key === percentKey) {
                 updatedSettings[amountKey] = Math.round((percent / 100) * pot);
            }
        });

        return updatedSettings; 
    });
  }, []); // No dependencies needed

  const handleGameModeChange = useCallback((e) => { 
    const newMode = e.target.value;
    handleSettingChange('Game Mode', newMode); 
    setConfirmModal({
        isOpen: true,
        title: 'Change Game Mode?',
        message: `Are you sure you want to change the mode to "${newMode}"? This will be saved to your Google Sheet. Random numbers might need to be regenerated.`,
        onConfirm: () => postAdminAction('setGameMode', { mode: newMode }), 
        onCancel: () => handleSettingChange('Game Mode', settings['Game Mode'] || '4 Quarters')
    });
  }, [handleSettingChange, postAdminAction, settings]); 


  // Handler to save all settings to backend
  const handleSaveSettings = useCallback(() => {
     const numericFields = ['Cost Per Square', 'Payout Q1 Percent', 'Payout Q2 Percent', 'Payout Q3 Percent', 'Payout Final Percent']; 
     let isValid = true;
     let totalPercent = 0; 

     // Need to read from localSettings for validation
     const settingsToValidate = { ...localSettings };

     for (const field of numericFields) {
         const value = settingsToValidate[field];
         if (value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
              showToast(`Invalid value for ${field}. Please enter a non-negative number or leave blank.`, 'error');
              isValid = false;
              break; 
         }
          if (field.endsWith(' Percent') && Number(value) > 100) {
               showToast(`Percentage for ${field.replace(' Percent', '')} cannot exceed 100.`, 'error');
               isValid = false;
               break;
          }
          if (field.endsWith(' Percent')) {
              totalPercent += Number(value) || 0;
          }
     }
      if (isValid && Math.round(totalPercent) !== 100) { // Check rounded value
          showToast(`Warning: Payout percentages add up to ${totalPercent}%, not 100%.`, 'warning');
      }

      const urlFields = ['Home Team Logo URL', 'Away Team Logo URL'];
       for (const field of urlFields) {
           const value = settingsToValidate[field];
           if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
               showToast(`Invalid URL for ${field}. Please include http:// or https://, or leave blank.`, 'error');
               isValid = false;
               break; 
           }
       }


     if (isValid) {
         // Recalculate final dollar amounts just before saving
         const finalSettingsToSave = { ...localSettings };
         const finalCost = Number(finalSettingsToSave['Cost Per Square']) || 0;
         const finalPot = finalCost * 100;
         ['Payout Q1', 'Payout Q2', 'Payout Q3', 'Payout Final'].forEach(amountKey => {
             const percentKey = `${amountKey} Percent`;
             const percent = Number(finalSettingsToSave[percentKey]) || 0;
             finalSettingsToSave[amountKey] = Math.round((percent / 100) * finalPot); 
         });

        postAdminAction('updateSettings', finalSettingsToSave);
     }
  }, [localSettings, postAdminAction, showToast, totalPot]); // Added totalPot dependency

  // Handler for editing player form input changes
  const handleEditingPlayerChange = useCallback((key, value) => {
    if (key === 'Initials') {
        value = value.toUpperCase().slice(0, 3);
    }
    setEditingPlayer(prev => ({ ...prev, [key]: value }));
  }, []); 

  // Handler to save player edits to backend
  const handleUpdatePlayer = useCallback(async () => {
    if (!editingPlayer) return;
    
    const squaresRaw = editingPlayer.Squares || '';
    if (squaresRaw && !/^[0-9,\s]*$/.test(squaresRaw)) {
         showToast('Invalid characters in Squares. Please use only numbers, commas, and spaces.', 'error');
         return;
    }
    const squaresArray = squaresRaw
        .replace(/\s/g, '') 
        .split(',')        
        .filter(Boolean)   
        .map(s => parseInt(s, 10)) 
        .filter(n => !isNaN(n) && n >= 1 && n <= 100); 
    
    const uniqueSquares = [...new Set(squaresArray)];
    if (uniqueSquares.length !== squaresArray.length) {
        showToast('Duplicate square numbers found. Please remove duplicates.', 'warning');
        setEditingPlayer(prev => ({ ...prev, Squares: uniqueSquares.join(',') }));
        return; 
    }

    const squaresCleaned = uniqueSquares.join(',');
     const playerToUpdate = { ...editingPlayer, Squares: squaresCleaned };

    const success = await postAdminAction('updatePlayer', playerToUpdate);
    if (success) {
      setEditingPlayer(null); 
    }
  }, [editingPlayer, postAdminAction, showToast]); 


  // --- RENDER --- //
  if (isLoading) {
      return (<div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col items-center justify-center"><RefreshCwIcon className="animate-spin h-12 w-12 mb-4"/><p className="text-xl font-russo">Loading Football Squares...</p></div>);
  }
  
  const renderStartupError = () => {
      if (typeof startupError === 'string' && startupError.includes('<b>')) {
          return <span dangerouslySetInnerHTML={{ __html: startupError }}></span>;
      }
      return <span>{startupError}</span>;
  };

  if (startupError) {
      return (
          <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
              <AlertTriangleIcon className="text-red-500 h-16 w-16 mb-4"/>
              <h2 className="text-2xl font-russo text-red-600 dark:text-red-400 mb-2">Connection Error</h2>
              <div className="max-w-2xl bg-white dark:bg-gray-800 p-4 rounded-lg font-sans-readable text-left shadow-lg">
                  <p className="mb-4 text-gray-700 dark:text-gray-300">The application could not connect to the Google Sheet backend. Details:</p>
                  <p className="text-yellow-600 dark:text-yellow-400">{renderStartupError()}</p> 
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Please check your Google Apps Script (Spreadsheet ID, deployment permissions) and your internet connection.</p>
              </div>
          </div>
      );
  }


  const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md font-sans-readable">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-russo text-yellow-600 dark:text-yellow-400"><AlertTriangleIcon className="text-yellow-500 dark:text-yellow-400"/> {title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end gap-4">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg font-russo">Cancel</button>
                <button onClick={() => { onConfirm(); onCancel(); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white font-bold rounded-lg font-russo">Confirm</button>
            </div>
        </div>
      </div>
    );
  };
  
  const RandomizingModal = ({ isOpen }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"> 
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
                <div className="flex justify-center gap-4 text-6xl mb-4">
                    <span className="animate-roll">🎲</span>
                    <span className="animate-roll" style={{animationDelay: '0.1s'}}>🎲</span>
                </div>
                <h3 className="text-2xl font-bold font-russo text-yellow-600 dark:text-yellow-400">Randomizing Numbers...</h3>
            </div>
        </div>
    );
  };

  const StatCard = ({ icon, title, value, color = 'text-yellow-600 dark:text-yellow-400' }) => (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-4 shadow">
      <div className={`p-2 bg-gray-300 dark:bg-gray-800 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-sans-readable">{title}</p>
        <p className={`text-2xl font-bold font-russo ${color}`}>{value}</p>
      </div>
    </div>
  );

  // Main App Return - Added theme classes
  return (
    <div className={`min-h-screen font-russo p-4 sm:p-6 lg:p-8 no-select ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-white'}`}> 
      <div className="max-w-7xl mx-auto">
        <ConfirmationModal 
            isOpen={confirmModal.isOpen} 
            title={confirmModal.title}
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => { 
                setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
                if (confirmModal.title === 'Change Game Mode?') {
                    // Revert game mode change in local state if cancelled
                    handleSettingChange('Game Mode', settings['Game Mode'] || '4 Quarters');
                }
            }} 
        />
        <RandomizingModal isOpen={isRandomizing} />
        <header className={`rounded-xl p-4 mb-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 ${theme === 'light' ? 'bg-white shadow-gray-300' : 'bg-gray-800 shadow-black/30'}`}>
             <div className="flex items-center justify-center md:justify-start gap-4 w-full md:w-1/3">
                 <img 
                     src={settings['Away Team Logo URL']} 
                     alt={settings['Away Team Name']} 
                     className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                     onError={(e) => { e.target.style.display = 'none'; }} 
                 />
                 <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{settings['Away Team Name']}</span>
             </div>
             <div className="text-center w-full md:w-1/3 order-first md:order-none tracking-wider">
                 <h1 className={`text-xl sm:text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-yellow-400'}`}>{settings['Title'] || 'Super Bowl Squares'}</h1>
                 <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{new Date().getFullYear()}</span>
             </div>
             <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-1/3">
                 <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{settings['Home Team Name']}</span>
                 <img 
                     src={settings['Home Team Logo URL']} 
                     alt={settings['Home Team Name']} 
                     className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                     onError={(e) => { e.target.style.display = 'none'; }}
                 />
             </div>
        </header>

        <div className={`rounded-xl p-4 mb-6 shadow-lg flex flex-col sm:flex-row items-center justify-around text-center gap-4 ${theme === 'light' ? 'bg-white shadow-gray-300' : 'bg-gray-800 shadow-black/30'}`}>
            <div className="flex flex-col">
                <span className={`text-sm font-sans-readable ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Pot</span>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">${totalPot}</span> 
            </div>
            <div className={`h-16 w-px hidden sm:block ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
            <div className="flex items-center gap-4 sm:gap-6 text-lg">
                <TrophyIcon className="text-yellow-500 dark:text-yellow-400 h-8 w-8"/>
                <div className="text-left font-sans-readable">
                    <p><span className="font-bold text-orange-600 dark:text-orange-400">Q1:</span> ${settings?.['Payout Q1'] || '0'}</p>
                    <p><span className="font-bold text-yellow-600 dark:text-yellow-300">Q2:</span> ${settings?.['Payout Q2'] || '0'}</p>
                </div>
                <div className="text-left font-sans-readable">
                    <p><span className="font-bold text-blue-600 dark:text-blue-400">Q3:</span> ${settings?.['Payout Q3'] || '0'}</p>
                    <p><span className="font-bold text-purple-600 dark:text-purple-400">Final:</span> ${settings?.['Payout Final'] || '0'}</p>
                </div>
            </div>
        </div>
        
        <div className="flex justify-between items-center mb-4 px-2 gap-2">
            {/* --- Sync Button --- */}
            <button onClick={() => fetchData(false)} disabled={isRefreshing} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"> 
              <RefreshCwIcon className={isRefreshing ? 'animate-spin' : ''}/>
              <span className="hidden sm:inline">Sync</span>
            </button>
            <div className={`flex items-center gap-2 text-base font-bold px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-white shadow' : 'bg-gray-800'}`}>
              <TagIcon className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}/>
              <span>Cost:</span>
              <span className="text-yellow-600 dark:text-yellow-400">${Number(settings?.['Cost Per Square']) || 0}</span> 
            </div>
            {/* --- Theme Toggle Button --- */}
            <div className="flex items-center gap-2">
                 <button onClick={toggleTheme} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105 ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                     <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
                 </button>
                 <button onClick={() => setShowAdminPanel(prev => !prev)} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105 ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                    <LockIcon/>
                    <span className="hidden sm:inline">Admin</span>
                 </button>
            </div>
             {/* --- END Theme Toggle Button --- */}
        </div>

        <main className="flex flex-col lg:flex-row gap-6">
          {/* --- Grid Container --- */}
          <div className="lg:w-2/3">
             {/* Adjusted team name colors */}
            <h2 className={`text-lg sm:text-xl font-bold mb-2 tracking-widest text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              {settings['Home Team Name']}
            </h2>
            <div className="flex items-center justify-center gap-1 sm:gap-2"> 
              <h2 className={`writing-mode-v-rl rotate-180 text-base sm:text-lg font-bold tracking-widest text-center px-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}> 
                {settings['Away Team Name']}
              </h2>
              {/* --- Main Grid Area --- */}
               {/* Adjusted background color */}
              <div className={`p-1 rounded-xl shadow-lg relative overflow-hidden flex-1 ${theme === 'light' ? 'bg-white shadow-gray-300' : 'bg-gray-800 shadow-black/30'}`}> 
                  <div className="grid grid-cols-11 gap-[1px] sm:gap-0.5"> 
                      
                       {/* --- FINAL Top-Left Corner --- */}
                       <div className={`relative aspect-square rounded-sm text-[5px] xs:text-[6px] sm:text-[9px] font-sans-readable overflow-hidden grid-cell-min-width p-[1px] sm:p-0.5 ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
                           {settings['Game Mode'] === '4 Quarters' && (
                               <div className="relative w-full h-full"> {/* Container for absolute positioning */}
                                   {/* Horizontal Labels (Bottom Edge) */}
                                   <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4">
                                       <span className="col-start-1 flex items-end justify-center font-bold text-orange-600 dark:text-orange-400">Q1</span>
                                       <span className="col-start-2 flex items-end justify-center font-bold text-yellow-600 dark:text-yellow-300">Q2</span>
                                       <span className="col-start-3 flex items-end justify-center font-bold text-blue-600 dark:text-blue-400">Q3</span>
                                       {/* F is positioned separately */}
                                   </div>
                                   {/* Vertical Labels (Right Edge) */}
                                   <div className="absolute top-0 bottom-0 right-0 grid grid-rows-4">
                                       <span className="row-start-1 flex items-center justify-end font-bold text-orange-600 dark:text-orange-400">Q1</span>
                                       <span className="row-start-2 flex items-center justify-end font-bold text-yellow-600 dark:text-yellow-300">Q2</span>
                                       <span className="row-start-3 flex items-center justify-end font-bold text-blue-600 dark:text-blue-400">Q3</span>
                                        {/* F is positioned separately */}
                                   </div>
                                    {/* Shared Final Label (Bottom Right Corner) */}
                                   <span className="absolute bottom-0 right-0 flex items-end justify-end font-bold text-purple-600 dark:text-purple-400 pr-0.5 pb-0.5">F</span>
                               </div>
                           )}
                       </div>
                       {/* --- END FINAL Top-Left Corner --- */}


                      {/* 2. Home Numbers */}
                      {Array.from({ length: 10 }).map((_, colIndex) => (
                        <div key={`home-header-${colIndex}`} className={`flex items-center justify-center rounded-sm font-bold aspect-square p-[1px] sm:p-0.5 overflow-hidden grid-cell-min-width ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-yellow-400'}`}>
                          {settings['Game Mode'] === '4 Quarters' ? (
                            <div className="grid grid-rows-4 gap-[1px] text-center text-[5px] xs:text-[7px] sm:text-[10px] w-full h-full font-sans-readable">
                              {/* Adjusted number background */}
                              <span className={`flex items-center justify-center font-bold text-orange-600 dark:text-orange-400 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q1?.home?.[colIndex] ?? ''}</span>
                              <span className={`flex items-center justify-center font-bold text-yellow-600 dark:text-yellow-300 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q2?.home?.[colIndex] ?? ''}</span>
                              <span className={`flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q3?.home?.[colIndex] ?? ''}</span>
                              <span className={`flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q4?.home?.[colIndex] ?? ''}</span>
                            </div>
                          ) : (
                            <span className="text-sm xs:text-base sm:text-lg">{fullGameNumbers?.home?.[colIndex] ?? ''}</span> 
                          )}
                        </div>
                      ))}

                      {/* 3. Away Numbers + 100 Squares */}
                      {Array.from({ length: 10 }).map((_, rowIndex) => (
                          <Fragment key={`row-${rowIndex}`}>
                              {/* Away Numbers */}
                              <div className={`flex items-center justify-center rounded-sm font-bold aspect-square p-[1px] sm:p-0.5 overflow-hidden grid-cell-min-width ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-yellow-400'}`}>
                                  {settings['Game Mode'] === '4 Quarters' ? (
                                    <div className="grid grid-cols-4 gap-[1px] text-center text-[5px] xs:text-[7px] sm:text-[10px] w-full h-full font-sans-readable"> 
                                      {/* Adjusted number background */}
                                      <span className={`flex items-center justify-center font-bold text-orange-600 dark:text-orange-400 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q1?.away?.[rowIndex] ?? ''}</span>
                                      <span className={`flex items-center justify-center font-bold text-yellow-600 dark:text-yellow-300 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q2?.away?.[rowIndex] ?? ''}</span>
                                      <span className={`flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q3?.away?.[rowIndex] ?? ''}</span>
                                      <span className={`flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 rounded-sm ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>{fourQuarterNumbers?.q4?.away?.[rowIndex] ?? ''}</span>
                                    </div>
                                  ) : (
                                    <span className="text-sm xs:text-base sm:text-lg">{fullGameNumbers?.away?.[rowIndex] ?? ''}</span> 
                                  )}
                              </div>

                              {/* 100 Squares */}
                              {Array.from({ length: 10 }).map((_, colIndex) => {
                                  const squareNumber = rowIndex * 10 + colIndex + 1;
                                  const claimed = claimedSquaresMap.get(squareNumber);
                                  const isSelected = selectedSquares.includes(squareNumber);
                                  const winnerClasses = []; const winnerBadges = [];
                                  
                                  Object.entries(winningSquares || {}).forEach(([quarter, num]) => { 
                                      if(num === squareNumber) { 
                                          if (quarter === 'Q1') { winnerClasses.push('border-orange-500'); winnerBadges.push({q: 'Q1', c: 'bg-orange-500'}); } 
                                          if (quarter === 'Q2') { winnerClasses.push('border-yellow-400'); winnerBadges.push({q: 'Q2', c: 'bg-yellow-400'}); } 
                                          if (quarter === 'Q3') { winnerClasses.push('border-blue-500'); winnerBadges.push({q: 'Q3', c: 'bg-blue-500'}); } 
                                          if (quarter === 'Q4') { winnerClasses.push('border-purple-500'); winnerBadges.push({q: 'F', c: 'bg-purple-500'}); } 
                                      } 
                                  });
                                   // Adjusted border colors and square background/hover
                                  const borderClass = winnerClasses.length > 0 ? winnerClasses.join(' ') + ' border-2 sm:border-4' : isSelected ? 'border-2 sm:border-4 border-green-500' : claimed && !claimed.paid ? 'border border-red-500 sm:border-2' : `border ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'} sm:border-2`; 
                                  const bgClass = claimed ? (theme === 'light' ? 'bg-gray-100' : 'bg-gray-700') : (theme === 'light' ? 'bg-white hover:bg-gray-100' : 'bg-gray-900 hover:bg-gray-700');

                                  return (
                                    <div 
                                      key={squareNumber} 
                                      onClick={() => handleSquareClick(squareNumber)} 
                                      className={`relative aspect-square flex flex-col items-center justify-center rounded-sm transition-all duration-200 cursor-pointer ${borderClass} ${bgClass} grid-cell-min-width`}
                                    >
                                       {/* Adjusted text colors */}
                                      <span className={`absolute top-0 left-0.5 text-[5px] xs:text-[6px] sm:text-[9px] font-sans-readable ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>{squareNumber}</span> 
                                      {claimed && <span className={`text-[6px] xs:text-[7px] sm:text-[10px] font-semibold text-center break-all px-0.5 font-sans-readable ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{claimed.initials || claimed.name}</span>} 
                                      {winnerBadges.length > 0 && <div className="absolute top-0.5 right-0.5 flex flex-col gap-0.5">{winnerBadges.map(b => (<span key={b.q} className={`text-[5px] xs:text-[6px] font-bold px-0.5 sm:px-1 rounded-full ${b.c} ${theme === 'light' ? 'text-white': 'text-gray-900'}`}>{b.q}</span>))}</div>} 
                                    </div>
                                  );
                              })}
                          </Fragment>
                      ))}
                  </div>
              </div>
            </div>

            {/* Legend */}
             {/* Adjusted background and text colors */}
            <div className={`mt-4 rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm font-sans-readable ${theme === 'light' ? 'bg-white shadow' : 'bg-gray-800'}`}>
                <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded border-2 ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-900'}`}></div><span>Available</span></div>
                <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded border-2 border-red-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}></div><span>Claimed (Unpaid)</span></div>
                <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded border-4 border-orange-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}></div><span>Q1 Winner</span></div>
                <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded border-4 border-yellow-400 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}></div><span>Q2 Winner</span></div>
                <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded border-4 border-blue-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}></div><span>Q3 Winner</span></div>
                <div className="flex items-center gap-2"><div className={`w-4 h-4 rounded border-4 border-purple-500 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}></div><span>Final Winner</span></div>
            </div>
          </div>

          {/* --- Claim Form (Right Side) --- */}
           {/* Adjusted background, text, input styles */}
          <div className={`lg:w-1/3 p-6 rounded-xl shadow-lg font-sans-readable ${theme === 'light' ? 'bg-white shadow-gray-300' : 'bg-gray-800 shadow-black/30'}`}>
            <h2 className={`text-2xl font-bold mb-4 text-center font-russo ${theme === 'light' ? 'text-blue-600' : 'text-yellow-400'}`}>Claim Your Squares</h2>
            <form onSubmit={handleClaimSubmit}>
              <div className="mb-4">
                  <label className={`block mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="name">Your Name</label>
                  <input type="text" id="name" value={formName} onChange={(e) => setFormName(e.target.value)} required className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-900' : 'bg-gray-700 border-gray-600 focus:border-yellow-400 text-white'}`}/>
              </div> 
              <div className="mb-4">
                  <label className={`block mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="initials">Your Initials (Max 3)</label>
                  <input type="text" id="initials" value={formInitials} onChange={(e) => setFormInitials(e.target.value.toUpperCase().slice(0, 3))} maxLength={3} required className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-900' : 'bg-gray-700 border-gray-600 focus:border-yellow-400 text-white'}`}/>
              </div> 
              <div className="mb-4">
                  <label className={`block mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Selected Squares ({selectedSquares.length})</label>
                  <div className={`border-2 rounded-lg p-2 min-h-[44px] break-words ${theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-gray-200'}`}>
                      {selectedSquares.length > 0 ? selectedSquares.sort((a,b) => a - b).join(', ') : <span className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'}>Click squares on the grid</span>}
                  </div>
              </div>
              <div className="flex gap-2 mb-4">
                  <input 
                      type="number" 
                      placeholder="#" 
                      value={numToRandomize} 
                      onChange={e => setNumToRandomize(e.target.value)} 
                      className={`w-1/3 border-2 rounded-lg p-2 focus:outline-none text-center ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-900' : 'bg-gray-700 border-gray-600 focus:border-yellow-400 text-white'}`}
                      min="1" step="1" pattern="\d*" 
                  />
                  <button type="button" onClick={handleRandomizeSelection} className="w-2/3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 font-russo">
                    <Dice5Icon/> Pick Random
                  </button>
              </div>
              {/* --- PAYMENT METHOD SECTION --- */}
              <div className="mb-4"> 
                  <label className={`block mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="payment">Payment Method</label>
                  <select 
                      id="payment" 
                      value={formPaymentMethod} 
                      onChange={e => setFormPaymentMethod(e.target.value)} 
                      className={`w-full border-2 rounded-lg p-2 focus:outline-none appearance-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-900' : 'bg-gray-700 border-gray-600 focus:border-yellow-400 text-white'}`}
                      required 
                  >
                       <option value="" disabled={formPaymentMethod !== ""}>Select method</option> 
                      {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
              </div>
               {/* Display payment account info */}
              {formPaymentMethod && settings[`${formPaymentMethod} Account`] && (
                <div className={`mb-4 -mt-2 text-center p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Send payment to:</p>
                    <p className={`font-bold break-words ${theme === 'light' ? 'text-blue-600' : 'text-yellow-300'}`}>{settings[`${formPaymentMethod} Account`]}</p> 
                </div>
              )}

              <div className={`rounded-lg p-4 text-center mb-4 font-russo ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Total Cost</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">${selectedSquares.length * (Number(settings?.['Cost Per Square']) || 0)}</p> 
              </div>
              <button 
                  type="submit" 
                  disabled={isSubmitting || selectedSquares.length === 0} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 font-russo flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <RefreshCwIcon className="animate-spin h-6 w-6" /> : 'Claim Squares'}
              </button>
            </form>
          </div>
        </main>

        {/* --- ADMIN PANEL MODAL --- */}
        {/* Adjusted styles for theme */}
        {showAdminPanel && (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4"><div className={`rounded-xl shadow-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative font-sans-readable ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
            <button onClick={() => setShowAdminPanel(false)} className={`absolute top-4 right-4 text-3xl ${theme === 'light' ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}>&times;</button>
            <h2 className={`text-2xl font-bold mb-6 text-center font-russo ${theme === 'light' ? 'text-blue-600' : 'text-yellow-400'}`}>Admin Panel</h2>
            {!isAdmin ? (<form onSubmit={handleAdminLogin} className="flex flex-col items-center">
                <label className={`mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="admin-pass">Enter Admin Password</label>
                <input type="password" id="admin-pass" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={`border-2 rounded-lg p-2 mb-4 w-64 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg font-russo">Login</button>
            </form>)
            : (
            <>
              {/* --- STATS SECTION --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                 {/* StatCard already handles theme */}
                <StatCard icon={<DollarSignIcon />} title="Total Pot" value={`$${totalPot}`} color="text-green-600 dark:text-green-400" />
                <StatCard icon={<GridIcon />} title="Squares Claimed" value={adminStats.totalClaimed} color="text-blue-600 dark:text-blue-400" />
                <StatCard icon={<GridIcon />} title="Squares Available" value={adminStats.totalAvailable} color={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}/>
                <StatCard icon={<CheckCircleIcon />} title="Players Paid" value={adminStats.totalPaid} color="text-green-600 dark:text-green-400" />
                <StatCard icon={<XCircleIcon />} title="Players Unpaid" value={adminStats.totalUnpaid} color="text-red-600 dark:text-red-400" />
              </div>

              {/* --- Main Admin Content --- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- COLUMN 1: Player Management --- */}
                <div className="lg:col-span-1">
                  {editingPlayer ? (
                    // --- EDIT PLAYER FORM ---
                    <div>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><EditIcon/> Edit Player</h3>
                      <div className={`p-4 rounded-lg space-y-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                        <div>
                          <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="edit-name">Name</label>
                          <input type="text" id="edit-name" value={editingPlayer?.Name || ''} readOnly className={`w-full border-2 rounded-lg p-2 focus:outline-none opacity-70 cursor-not-allowed ${theme === 'light' ? 'bg-gray-200 border-gray-400' : 'bg-gray-600 border-gray-500'}`}/>
                        </div>
                        <div>
                          <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="edit-initials">Initials (Max 3)</label>
                          <input type="text" id="edit-initials" value={editingPlayer?.Initials || ''} onChange={(e) => handleEditingPlayerChange('Initials', e.target.value)} maxLength={3} className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-white border-gray-300 focus:border-blue-500' : 'bg-gray-600 border-gray-500 focus:border-yellow-400'}`}/>
                        </div>
                        <div>
                          <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="edit-squares">Squares (comma-separated)</label>
                          <input type="text" id="edit-squares" value={editingPlayer?.Squares || ''} onChange={(e) => handleEditingPlayerChange('Squares', e.target.value)} className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-white border-gray-300 focus:border-blue-500' : 'bg-gray-600 border-gray-500 focus:border-yellow-400'}`}/>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => setEditingPlayer(null)} className={`w-1/2 font-bold py-2 px-4 rounded-lg font-russo ${theme === 'light' ? 'bg-gray-400 hover:bg-gray-500 text-white' : 'bg-gray-500 hover:bg-gray-400 text-white'}`}>Cancel</button>
                          <button onClick={handleUpdatePlayer} className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg font-russo flex items-center justify-center gap-2"><SaveIcon /> Save</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // --- PLAYER PAYMENTS LIST ---
                    <div>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><UserIcon/> Player Payments</h3>
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {players && players.length > 0 ? players.map(player => (
                          player && player.Name && ( 
                            <div key={player.Name} className={`p-3 rounded-lg flex justify-between items-center gap-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}> 
                              <div className="flex-1 min-w-0"> 
                                <p className={`font-bold truncate ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{player.Name} ({player.Initials})</p> 
                                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{String(player.Squares || '').split(',').filter(Boolean).length} squares - ${player.Cost} ({player.PaymentMethod})</p>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0"> 
                                <button onClick={() => handleMarkAsPaid(player.Name, 'Yes')} className={`p-1 rounded-full ${player.Paid === 'Yes' ? 'bg-green-500 text-white' : `${theme === 'light' ? 'text-gray-500 hover:bg-green-100 hover:text-green-600' : 'text-gray-400 hover:bg-green-600 hover:text-white'}`}`}><CheckCircleIcon/></button>
                                <button onClick={() => handleMarkAsPaid(player.Name, 'No')} className={`p-1 rounded-full ${player.Paid === 'No' ? 'bg-red-500 text-white' : `${theme === 'light' ? 'text-gray-500 hover:bg-red-100 hover:text-red-600' : 'text-gray-400 hover:bg-red-600 hover:text-white'}`}`}><XCircleIcon/></button>
                                <button onClick={() => setEditingPlayer(player)} className={`p-1 rounded-full ${theme === 'light' ? 'text-blue-500 hover:bg-blue-100' : 'text-blue-400 hover:bg-blue-500 hover:text-white'}`}><EditIcon/></button>
                                <button onClick={() => handleDeletePlayer(player.Name)} className={`p-1 rounded-full ${theme === 'light' ? 'text-red-500 hover:bg-red-100' : 'text-red-500 hover:bg-red-500 hover:text-white'}`}><Trash2Icon/></button>
                              </div>
                            </div>
                          )
                        )) : <p className={`text-center py-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No players have claimed squares yet.</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* --- COLUMN 2: Game Settings & Scores --- */}
                {/* Input styles adjusted for theme */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><Dice5Icon/> Randomize Numbers</h3>
                    <div className="flex gap-4">
                      <button onClick={() => handleRandomizeNumbers('Full Game')} disabled={claimedSquaresMap.size < 100} title={claimedSquaresMap.size < 100 ? 'All squares must be claimed first' : 'Randomize numbers for full game'} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg font-russo disabled:opacity-50 disabled:cursor-not-allowed">Full Game</button>
                      <button onClick={() => handleRandomizeNumbers('4 Quarters')} disabled={claimedSquaresMap.size < 100} title={claimedSquaresMap.size < 100 ? 'All squares must be claimed first' : 'Randomize numbers for 4 quarters'} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg font-russo disabled:opacity-50 disabled:cursor-not-allowed">4 Quarters</button>
                    </div>
                     {claimedSquaresMap.size < 100 && <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 text-center">({100 - claimedSquaresMap.size} more squares needed)</p>}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><TrophyIcon/> Enter & Update Scores</h3>
                    <div className="space-y-2">
                      {localScores && localScores.map(score => (
                        score && score.Quarter && ( 
                            <div key={score.Quarter} className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-2">
                            <label className="font-bold">{score.Quarter === 'Q4' ? 'Final' : score.Quarter}</label>
                            <input 
                                type="number" 
                                placeholder={settings['Away Team Name']} 
                                value={score['Away Score'] ?? ''} 
                                onChange={(e) => handleLocalScoreChange(score.Quarter, 'Away Score', e.target.value)} 
                                className={`w-full border-2 text-center rounded-lg p-1 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}
                                min="0" 
                            />
                            <input 
                                type="number" 
                                placeholder={settings['Home Team Name']} 
                                value={score['Home Score'] ?? ''} 
                                onChange={(e) => handleLocalScoreChange(score.Quarter, 'Home Score', e.target.value)} 
                                className={`w-full border-2 text-center rounded-lg p-1 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}
                                min="0" 
                            />
                            <button onClick={() => handleScoreUpdate(score.Quarter)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-sm">Save</button>
                            </div>
                        )
                      ))}
                    </div>
                  </div>
                  <div className={`pt-6 ${theme === 'light' ? 'border-t border-gray-300' : 'border-t border-gray-700'}`}>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><AlertTriangleIcon className="text-red-500"/> New Game</h3>
                    <button onClick={handleNewGame} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg font-russo">Clear All Data</button>
                    <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Deletes all players, scores, and numbers. Settings will be kept.</p>
                  </div>
                </div>

                {/* --- COLUMN 3: App Settings --- */}
                 {/* Input styles adjusted for theme */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-russo"><SlidersIcon/> App & Game Settings</h3>
                  
                  {/* General Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-title">Title</label>
                      <input id="setting-title" type="text" value={localSettings['Title'] || ''} onChange={(e) => handleSettingChange('Title', e.target.value)} className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-cost">Cost Per Square</label>
                      <input id="setting-cost" type="number" value={localSettings['Cost Per Square'] || ''} onChange={(e) => handleSettingChange('Cost Per Square', e.target.value)} min="0" className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                    </div>
                  </div>

                  {/* Team Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-home-name">Home Team Name</label>
                      <input id="setting-home-name" type="text" value={localSettings['Home Team Name'] || ''} onChange={(e) => handleSettingChange('Home Team Name', e.target.value)} className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-away-name">Away Team Name</label>
                      <input id="setting-away-name" type="text" value={localSettings['Away Team Name'] || ''} onChange={(e) => handleSettingChange('Away Team Name', e.target.value)} className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-home-logo">Home Team Logo URL</label>
                    <input id="setting-home-logo" type="text" value={localSettings['Home Team Logo URL'] || ''} onChange={(e) => handleSettingChange('Home Team Logo URL', e.target.value)} placeholder="https://..." className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                  </div>
                  <div>
                    <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-away-logo">Away Team Logo URL</label>
                    <input id="setting-away-logo" type="text" value={localSettings['Away Team Logo URL'] || ''} onChange={(e) => handleSettingChange('Away Team Logo URL', e.target.value)} placeholder="https://..." className={`w-full border-2 rounded-lg p-2 focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}/>
                  </div>
                  
                  {/* --- MODIFIED PAYOUTS SECTION --- */}
                  <div className={`space-y-3 pt-4 ${theme === 'light' ? 'border-t border-gray-300' : 'border-t border-gray-700'}`}> 
                     <p className={`text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Payouts (Percentage of Total Pot: ${totalPot})</p>
                    {['Q1', 'Q2', 'Q3', 'Final'].map(q => {
                        const amountKey = `Payout ${q}`;
                        const percentKey = `${amountKey} Percent`;
                        const displayAmount = calculatePayoutAmount(percentKey); 
                        return (
                            <div key={q} className="grid grid-cols-[auto,1fr,auto] gap-2 items-center"> 
                                <label className={`block text-sm font-bold justify-self-end ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor={`setting-payout-${q}-percent`}>{q}:</label> 
                                <div className="flex items-center justify-center"> 
                                    <input 
                                        id={`setting-payout-${q}-percent`}
                                        type="number" 
                                        value={localSettings[percentKey] ?? ''} 
                                        onChange={(e) => handleSettingChange(percentKey, e.target.value)} 
                                        min="0" max="100" step="1"
                                        className={`w-16 border-2 rounded-lg p-2 text-center focus:outline-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}
                                    />
                                    <span className={`ml-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>%</span>
                                </div>
                                <span className={`text-sm justify-self-start ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}> = ${displayAmount}</span> 
                            </div>
                        );
                    })}
                   </div>
                  {/* --- END MODIFIED PAYOUTS --- */}


                  {/* Game Mode */}
                  <div className={`pt-4 ${theme === 'light' ? 'border-t border-gray-300' : 'border-t border-gray-700'}`}> 
                    <label className={`block text-sm font-bold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} htmlFor="setting-game-mode">Game Mode</label>
                    <select id="setting-game-mode" value={localSettings['Game Mode'] || '4 Quarters'} onChange={handleGameModeChange} className={`w-full border-2 rounded-lg p-2 focus:outline-none appearance-none ${theme === 'light' ? 'bg-gray-100 border-gray-300 focus:border-blue-500' : 'bg-gray-700 border-gray-600 focus:border-yellow-400'}`}>
                      <option value="4 Quarters">4 Quarters</option>
                      <option value="Full Game">Full Game</option>
                    </select>
                  </div>
                  
                  {/* Save Button */}
                  <button onClick={handleSaveSettings} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 font-russo flex items-center justify-center gap-2 mt-4"> 
                    <SaveIcon /> Save All Settings
                  </button>

                </div>
              </div>
            </>
            )}
        </div></div>)}

        {/* --- Toast Notification --- */}
        {/* Adjusted style for theme */}
        {toast.show && (<div className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out font-sans-readable ${
             toast.type === 'error' ? 'bg-red-600 text-white' 
           : toast.type === 'warning' ? 'bg-yellow-400 text-black' 
           : theme === 'light' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-green-600 text-white'}`}
          ><span dangerouslySetInnerHTML={{ __html: toast.message }}></span></div>)}
          
        {/* --- NEW Footer Credit --- */}
        <footer className={`text-center mt-8 text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} font-sans-readable`}>
             Created by Cam Quinci
        </footer>
        {/* --- END Footer Credit --- */}
      </div>
    </div>
  );
}

