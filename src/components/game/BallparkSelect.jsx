import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { generateWeather, generateIndoorWeather } from '@/lib/weather';
import { STADIUM_WEATHER_CITIES, DOMED_STADIUMS } from '@/lib/ballparks';
import { pickUmpire } from '@/lib/umpires';
import { Play, MapPin, Users, RefreshCw, Sun, Moon, Thermometer, Wind, Cloud, CloudRain, CloudSnow, UserCheck } from 'lucide-react';

export default function BallparkSelect({ userTeam, cpuTeam, onConfirm, onBack }) {
  const [selectedPark, setSelectedPark] = useState(null);
  const [selectedParkTeam, setSelectedParkTeam] = useState(null);
  const [weather, setWeather] = useState(null);
  const [umpire, setUmpire] = useState(null);

  const userTeamData = TEAMS[userTeam];
  const cpuTeamData = TEAMS[cpuTeam];

  const handleSelect = (park, teamKey) => {
    setSelectedPark(park);
    setSelectedParkTeam(teamKey);
    const stadium = TEAMS[teamKey].stadium;
    if (DOMED_STADIUMS.has(stadium)) {
      setWeather(generateIndoorWeather());
    } else {
      const weatherCity = STADIUM_WEATHER_CITIES[stadium] || TEAMS[teamKey].city;
      setWeather(generateWeather(weatherCity));
    }
    if (!umpire) setUmpire(pickUmpire());
  };

  const handleRegenerateWeather = () => {
    if (selectedParkTeam) {
      const stadium = TEAMS[selectedParkTeam].stadium;
      if (DOMED_STADIUMS.has(stadium)) {
        setWeather(generateIndoorWeather());
      } else {
        const weatherCity = STADIUM_WEATHER_CITIES[stadium] || TEAMS[selectedParkTeam].city;
        setWeather(generateWeather(weatherCity));
      }
    }
  };

  const handleRegenerateUmpire = () => {
    setUmpire(pickUmpire());
  };

  const handleConfirm = () => {
    if (selectedParkTeam && weather) {
      // DH rules apply if the HOME team is in the AL
      const useDH = TEAMS[selectedParkTeam].league === 'AL';
      onConfirm(selectedParkTeam, useDH, weather, umpire);
    }
  };

  const ParkCard = ({ teamKey, isUser }) => {
    const team = TEAMS[teamKey];
    const isSelected = selectedPark === team.stadium;
    const leagueRule = team.league === 'AL' ? 'DH RULES' : 'NO DH - PITCHER HITS';

    return (
      <button
        onClick={() => handleSelect(team.stadium, teamKey)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
            : 'border-border bg-card hover:border-primary/30 hover:bg-card/80'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-sm text-foreground">{team.stadium}</div>
            <div className="text-[10px] text-muted-foreground">
              {team.city} {team.name} · {team.league}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className={`text-[9px] font-heading font-bold px-2 py-0.5 rounded ${
              team.league === 'AL'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {team.league}
            </span>
          </div>
        </div>

        <div className={`rounded-lg p-3 ${
          team.league === 'AL' ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-emerald-500/5 border border-emerald-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <Users className={`w-3.5 h-3.5 ${team.league === 'AL' ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className={`text-[10px] font-heading font-bold uppercase tracking-wider ${
              team.league === 'AL' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {leagueRule}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {team.league === 'AL'
              ? 'Designated hitter bats for the pitcher. Both lineups use a DH in the 9th spot.'
              : 'Pitchers bat for themselves. The 9th spot in the order is the starting pitcher.'}
          </p>
        </div>

        {isSelected && (
          <div className="mt-3 text-[10px] font-heading font-bold text-primary uppercase tracking-wider text-center">
            Selected
          </div>
        )}
      </button>
    );
  };

  const WeatherIcon = ({ condition }) => {
    switch (condition) {
      case 'rain': return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'snow': return <CloudSnow className="w-4 h-4 text-blue-200" />;
      case 'overcast': return <Cloud className="w-4 h-4 text-muted-foreground" />;
      default: return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex items-start justify-center pt-6">
      <div className="max-w-lg w-full space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2.5">
            <span className="text-2xl">🏟️</span>
            <h1 className="font-display text-[11px] text-primary tracking-wider">1984: THE BASEBALL SEASON</h1>
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">Choose Ballpark</h2>
          <p className="font-body text-sm text-muted-foreground">
            {userTeamData.abbr} vs {cpuTeamData.abbr} - where should they play? The home team&apos;s league determines the DH rule.
          </p>
        </div>

        {/* Ballpark cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-heading uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Your Team - {userTeamData.name}
          </div>
          <ParkCard teamKey={userTeam} isUser={true} />

          <div className="flex items-center gap-2 text-[10px] font-heading uppercase tracking-wider text-amber-400 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Opponent - {cpuTeamData.name}
          </div>
          <ParkCard teamKey={cpuTeam} isUser={false} />
        </div>

        {/* Weather Panel */}
        {weather && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-foreground">Game Conditions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateWeather}
                className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Re-roll
              </Button>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              {/* Date & Time */}
              <div className="flex items-center gap-2">
                {weather.isDay ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-300" />
                )}
                <span className="font-heading text-sm font-bold text-foreground">{weather.date}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] font-heading text-muted-foreground">
                  {weather.isDay ? 'Day Game' : 'Night Game'}
                </span>
              </div>

              {/* Temp + Conditions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-heading text-sm font-bold text-foreground">{weather.temperature}°F</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <WeatherIcon condition={weather.condition} />
                  <span className="text-xs font-body text-foreground/80 capitalize">{weather.condition}</span>
                </div>
                {weather.windLabel && weather.windLabel !== 'Calm' && (
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-body text-foreground/80">{weather.windLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Effects */}
            {weather.effects.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Weather Effects</div>
                {weather.effects.map((e, i) => (
                  <div key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Umpire Panel */}
        {umpire && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-foreground">Home Plate Umpire</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateUmpire}
                className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Re-roll
              </Button>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="font-heading text-sm font-bold text-foreground">{umpire.name}</span>
                  <span className="text-[10px] font-heading italic text-primary/80 ml-2">"{umpire.nick}"</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{umpire.pregameLine}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {umpire.pitcherFriendly && (
                  <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">Pitcher's Ump</span>
                )}
                {umpire.hitterFriendly && (
                  <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">Hitter's Ump</span>
                )}
                <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                  Zone: {umpire.zone.type.charAt(0).toUpperCase() + umpire.zone.type.slice(1)}
                </span>
                {umpire.temperament?.quickEject && (
                  <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Quick Hook</span>
                )}
                {!umpire.temperament?.quickEject && umpire.temperament?.warningChance != null && (
                  umpire.temperament.warningChance >= 0.70 ? (
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">Long Fuse</span>
                  ) : umpire.temperament.warningChance <= 0.35 ? (
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Short Fuse</span>
                  ) : (
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">Even Temper</span>
                  )
                )}
                {umpire.consistency != null && (
                  umpire.consistency < 75 ? (
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">Unpredictable</span>
                  ) : umpire.consistency >= 95 ? (
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400">Rock Steady</span>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-shrink-0 font-heading text-sm">
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPark || !weather}
            className="flex-1 gap-2 font-heading text-sm py-5"
            size="lg"
          >
            <Play className="w-5 h-5" />
            {selectedPark && weather
              ? `Play Ball at ${TEAMS[selectedParkTeam]?.stadium}`
              : 'Select a ballpark'}
          </Button>
        </div>
      </div>
    </div>
  );
}