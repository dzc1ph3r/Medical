import { useEffect, useMemo, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, View, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useAuth } from "../context/AuthContext";
import type { Appointment } from "../types/appointment";
import { getMyDoctorAppointments, updateAppointmentStatus, rescheduleAppointment } from "../api/appointment.api";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  XCircle,
  CalendarDays,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  Download,
  Plus,
  Search,
  MoreVertical
} from "lucide-react";

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  resource: Appointment;
  status: string;
}

export default function Calendar() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMyDoctorAppointments(token);
      setAppointments(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (!token) return;
    const interval = setInterval(() => {
      load();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    setYear(date.getFullYear());
  }, [date]);

  // Filter appointments based on status and search
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesStatus = filterStatus === "ALL" || appointment.status === filterStatus;
      const matchesSearch = !searchQuery || 
        (typeof appointment.patient === 'object' && 
         appointment.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [appointments, filterStatus, searchQuery]);

  const events = useMemo(
    () =>
      filteredAppointments.map((a) => ({
        id: a._id,
        title: `${typeof a.patient === "string" ? "Patient" : a.patient?.name || 'Patient'} (${a.status})`,
        start: new Date(a.date),
        end: new Date(new Date(a.date).getTime() + 30 * 60000),
        resource: a,
        status: a.status,
      })),
    [filteredAppointments]
  );

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, idx) => current - 2 + idx);
  }, []);

  const yearAppointments = useMemo(
    () =>
      filteredAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getFullYear() === year;
      }),
    [filteredAppointments, year]
  );

  const appointmentStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: appointments.length,
      today: appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime();
      }).length,
      pending: appointments.filter(a => a.status === "PENDING").length,
      accepted: appointments.filter(a => a.status === "ACCEPTED").length,
    };
  }, [appointments]);

  const accept = async () => {
    if (!token || !selected) return;
    try {
      await updateAppointmentStatus(token, selected._id, "ACCEPTED");
      setSelected(null);
      await load();
    } catch (error) {
      console.error("Erreur lors de l'acceptation du rendez-vous:", error);
    }
  };

  const cancel = async () => {
    if (!token || !selected) return;
    const reason = window.prompt("Raison de l'annulation ?") || "";
    if (!reason) return;
    try {
      await updateAppointmentStatus(token, selected._id, "CANCELLED", reason);
      setSelected(null);
      await load();
    } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous:", error);
    }
  };

  const resched = async () => {
    if (!token || !selected) return;
    const iso = window.prompt("Nouvelle date ISO (ex: 2026-01-15T10:00:00.000Z) ?");
    if (!iso) return;
    try {
      await rescheduleAppointment(token, selected._id, iso);
      setSelected(null);
      await load();
    } catch (error) {
      console.error("Erreur lors du report du rendez-vous:", error);
    }
  };

  const eventStyleGetter = (event: Event) => {
    let backgroundColor = '#3b82f6'; // Default blue

    switch ((event as CalendarEvent).status) {
      case 'ACCEPTED':
        backgroundColor = '#10b981'; // Green
        break;
      case 'PENDING':
        backgroundColor = '#f59e0b'; // Amber
        break;
      case 'CANCELLED':
        backgroundColor = '#ef4444'; // Red
        break;
      case 'COMPLETED':
        backgroundColor = '#8b5cf6'; // Purple
        break;
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        border: 'none',
        color: 'white',
        padding: '2px 8px',
      },
    };
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-700">Veuillez vous connecter en tant que médecin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-blue-600" />
            Calendrier des rendez-vous
          </h1>
          <p className="text-slate-600">
            Gérez et suivez vos rendez-vous médicaux
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200 disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total RDV</p>
              <p className="text-3xl font-bold text-blue-600">{appointmentStats.total}</p>
            </div>
            <CalendarDays className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800">RDV aujourd'hui</p>
              <p className="text-3xl font-bold text-emerald-600">{appointmentStats.today}</p>
            </div>
            <Clock className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">En attente</p>
              <p className="text-3xl font-bold text-amber-600">{appointmentStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Confirmés</p>
              <p className="text-3xl font-bold text-green-600">{appointmentStats.accepted}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Year Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-slate-500" />
              <label className="text-sm font-medium text-slate-700">Année :</label>
            </div>
            <select
              value={year}
              onChange={(e) => {
                const nextYear = Number(e.target.value);
                setYear(nextYear);
                setDate(new Date(nextYear, date.getMonth(), 1));
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <label className="text-sm font-medium text-slate-700">Filtrer par :</label>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Accepté</option>
              <option value="CANCELLED">Annulé</option>
              <option value="COMPLETED">Terminé</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un patient..."
              className="pl-10 w-full lg:w-64 px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-slate-900">
              {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {(['month', 'week', 'day', 'agenda'] as const).map((viewOption) => (
              <button
                key={viewOption}
                onClick={() => setView(viewOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${
                  view === viewOption
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {viewOption === 'month' ? 'Mois' : 
                 viewOption === 'week' ? 'Semaine' : 
                 viewOption === 'day' ? 'Jour' : 'Agenda'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="calendar-container">
            <BigCalendar
              localizer={localizer}
              events={events}
              view={view}
              onView={(next) => setView(next)}
              date={date}
              onNavigate={(next) => setDate(next)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={(e: any) => setSelected(e.resource as Appointment)}
              views={["month", "week", "day", "agenda"]}
              eventPropGetter={eventStyleGetter}
              messages={{
                today: "Aujourd'hui",
                previous: "Précédent",
                next: "Suivant",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
                date: "Date",
                time: "Heure",
                event: "Événement",
                noEventsInRange: "Aucun rendez-vous dans cette période",
              }}
            />
          </div>
        )}
      </div>

      {/* Year Appointments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            Rendez-vous en {year} ({yearAppointments.length})
          </h3>
          <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>

        {yearAppointments.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Aucun rendez-vous programmé pour {year}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {yearAppointments.map((appointment) => {
              const patientName = typeof appointment.patient === "string" 
                ? appointment.patient 
                : appointment.patient?.name || 'Patient inconnu';
              const appointmentDate = new Date(appointment.date);
              
              return (
                <div 
                  key={appointment._id} 
                  className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                    appointment._id === selected?._id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200'
                  }`}
                  onClick={() => setSelected(appointment)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        appointment.status === 'ACCEPTED' ? 'bg-emerald-500' :
                        appointment.status === 'PENDING' ? 'bg-amber-500' :
                        appointment.status === 'CANCELLED' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}></div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        appointment.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                        appointment.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status === 'ACCEPTED' ? 'Confirmé' :
                         appointment.status === 'PENDING' ? 'En attente' :
                         appointment.status === 'CANCELLED' ? 'Annulé' : 'Terminé'}
                      </span>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <p className="font-medium text-slate-900">{patientName}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <p className="text-sm text-slate-600">
                      {appointmentDate.toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' à '}
                      {appointmentDate.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Appointment Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Détails du rendez-vous</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Patient</p>
                    <p className="text-slate-900">
                      {typeof selected.patient === "string" ? selected.patient : selected.patient?.name}
                    </p>
                    {typeof selected.patient === "object" && selected.patient?.email && (
                      <p className="text-sm text-slate-500">{selected.patient.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Date et heure</p>
                    <p className="text-slate-900">
                      {new Date(selected.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CalendarDays className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Statut</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selected.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      selected.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      selected.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selected.status === 'ACCEPTED' ? 'Confirmé' :
                       selected.status === 'PENDING' ? 'En attente' :
                       selected.status === 'CANCELLED' ? 'Annulé' : 'Terminé'}
                    </span>
                  </div>
                </div>
                
                {selected.cancelReason && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-sm font-medium text-red-800 mb-1">Raison d'annulation</p>
                    <p className="text-red-700">{selected.cancelReason}</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={accept}
                  disabled={selected.status === "ACCEPTED"}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accepter
                </button>
                
                <button
                  onClick={resched}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reporter
                </button>
                
                <button
                  onClick={cancel}
                  disabled={selected.status === "CANCELLED"}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}