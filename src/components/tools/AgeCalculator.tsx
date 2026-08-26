import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Copy, Check, Cake, Star, Award, RefreshCw } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [birthTime, setBirthTime] = useState<string>('09:30');
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [nowTick, setNowTick] = useState<Date>(new Date());
  const [copied, setCopied] = useState<boolean>(false);

  // Live ticking timer for precise seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getZodiac = (month: number, day: number) => {
    const dates = [
      { sign: 'Capricorn', icon: '♑', range: 'Dec 22 - Jan 19', element: 'Earth' },
      { sign: 'Aquarius', icon: '♒', range: 'Jan 20 - Feb 18', element: 'Air' },
      { sign: 'Pisces', icon: '♓', range: 'Feb 19 - Mar 20', element: 'Water' },
      { sign: 'Aries', icon: '♈', range: 'Mar 21 - Apr 19', element: 'Fire' },
      { sign: 'Taurus', icon: '♉', range: 'Apr 20 - May 20', element: 'Earth' },
      { sign: 'Gemini', icon: '♊', range: 'May 21 - Jun 20', element: 'Air' },
      { sign: 'Cancer', icon: '♋', range: 'Jun 21 - Jul 22', element: 'Water' },
      { sign: 'Leo', icon: '♌', range: 'Jul 23 - Aug 22', element: 'Fire' },
      { sign: 'Virgo', icon: '♍', range: 'Aug 23 - Sep 22', element: 'Earth' },
      { sign: 'Libra', icon: '♎', range: 'Sep 23 - Oct 22', element: 'Air' },
      { sign: 'Scorpio', icon: '♏', range: 'Oct 23 - Nov 21', element: 'Water' },
      { sign: 'Sagittarius', icon: '♐', range: 'Nov 22 - Dec 21', element: 'Fire' },
    ];
    const cutoffs = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
    const index = day > cutoffs[month - 1] ? month % 12 : month - 1;
    return dates[index];
  };

  const getChineseZodiac = (year: number) => {
    const animals = [
      { name: 'Rat', emoji: '🐀' },
      { name: 'Ox', emoji: '🐂' },
      { name: 'Tiger', emoji: '🐅' },
      { name: 'Rabbit', emoji: '🐇' },
      { name: 'Dragon', emoji: '🐉' },
      { name: 'Snake', emoji: '🐍' },
      { name: 'Horse', emoji: '🐎' },
      { name: 'Goat', emoji: '🐐' },
      { name: 'Monkey', emoji: '🐒' },
      { name: 'Rooster', emoji: '🐓' },
      { name: 'Dog', emoji: '🐕' },
      { name: 'Pig', emoji: '🐖' }
    ];
    return animals[(year - 4) % 12] || animals[0];
  };

  const calculateAge = () => {
    if (!birthDate) return null;

    const birth = new Date(`${birthDate}T${birthTime || '00:00'}:00`);
    const target = targetDate === new Date().toISOString().split('T')[0] 
      ? nowTick 
      : new Date(`${targetDate}T23:59:59`);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next Birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }

    const msUntilBday = nextBday.getTime() - target.getTime();
    const daysUntilBday = Math.floor(msUntilBday / (1000 * 60 * 60 * 24));
    const hoursUntilBday = Math.floor((msUntilBday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextBdayDayName = daysOfWeek[nextBday.getDay()];

    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilBday,
      hoursUntilBday,
      nextBdayDayName,
      zodiac,
      chineseZodiac,
      nextAge: years + 1,
    };
  };

  const ageData = calculateAge();

  const handleCopySummary = () => {
    if (!ageData) return;
    const summary = `I am ${ageData.years} years, ${ageData.months} months, and ${ageData.days} days old (${ageData.totalDays.toLocaleString()} total days alive!). Calculated via Toolsbar.`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="age-calculator-tool">
      {/* Input Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Cake className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          />
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Birth Time (Optional)
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          />
        </div>

        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Calculate Age As Of
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          />
        </div>

        <div className="md:col-span-1 flex items-end">
          <button
            onClick={() => {
              setTargetDate(new Date().toISOString().split('T')[0]);
            }}
            title="Reset to today"
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {ageData ? (
        <div className="space-y-6">
          {/* Main Hero Age Display */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-indigo-950/70 via-[#131a33]/80 to-[#0e1222]/90 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-300">
                  Exact Chronological Age
                </span>
                <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight">
                      {ageData.years}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-indigo-300">Years</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
                      {ageData.months}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-indigo-300">Months</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
                      {ageData.days}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-indigo-300">Days</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mt-2">
                  {ageData.totalMonths} total months or {ageData.totalDays.toLocaleString()} days since birth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={handleCopySummary}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Summary!' : 'Share Age Summary'}
                </button>
              </div>
            </div>
          </div>

          {/* Next Birthday & Horoscope Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Birthday Card */}
            <div className="rounded-2xl p-6 bg-neutral-900/50 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Cake className="w-4 h-4" /> Next Birthday (Turns {ageData.nextAge})
                </span>
                <span className="text-xs font-mono text-neutral-400">{ageData.nextBdayDayName}</span>
              </div>
              <div className="text-3xl font-extrabold font-display text-white">
                {ageData.daysUntilBday} <span className="text-lg font-normal text-neutral-400">days</span>
              </div>
              <div className="text-xs text-neutral-400 mt-2">
                and {ageData.hoursUntilBday} hours remaining until your next celebration.
              </div>
            </div>

            {/* Western Zodiac */}
            <div className="rounded-2xl p-6 bg-neutral-900/50 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Star className="w-4 h-4" /> Sun Sign
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {ageData.zodiac.element}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ageData.zodiac.icon}</span>
                <div>
                  <div className="text-xl font-bold text-white">{ageData.zodiac.sign}</div>
                  <div className="text-xs text-neutral-400">{ageData.zodiac.range}</div>
                </div>
              </div>
            </div>

            {/* Chinese Zodiac */}
            <div className="rounded-2xl p-6 bg-neutral-900/50 dark:bg-[#121624]/70 border border-white/10 backdrop-blur-xl flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Eastern Zodiac
                </span>
                <span className="text-xs text-neutral-400">Lunar Cycle</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ageData.chineseZodiac.emoji}</span>
                <div>
                  <div className="text-xl font-bold text-white">Year of the {ageData.chineseZodiac.name}</div>
                  <div className="text-xs text-neutral-400">Chinese Horoscope</div>
                </div>
              </div>
            </div>
          </div>

          {/* Granular Lifetime Metrics Breakdown */}
          <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl">
            <div className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Life Lived in All Time Units
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Months', value: ageData.totalMonths.toLocaleString(), unit: 'months' },
                { label: 'Total Weeks', value: ageData.totalWeeks.toLocaleString(), unit: 'weeks' },
                { label: 'Total Days', value: ageData.totalDays.toLocaleString(), unit: 'days' },
                { label: 'Total Hours', value: ageData.totalHours.toLocaleString(), unit: 'hours' },
                { label: 'Total Minutes', value: ageData.totalMinutes.toLocaleString(), unit: 'mins' },
                { label: 'Total Seconds', value: ageData.totalSeconds.toLocaleString(), unit: 'secs (live)' },
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col justify-between">
                  <span className="text-[11px] text-neutral-400 font-medium">{m.label}</span>
                  <div className="text-lg font-bold font-mono text-white mt-1 break-all">{m.value}</div>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider mt-0.5">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl bg-black/20 border border-white/10 text-neutral-400 text-sm">
          Please select a valid date of birth before the target date.
        </div>
      )}
    </div>
  );
};
