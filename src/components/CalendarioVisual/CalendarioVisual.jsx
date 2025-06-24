import React, { useState, useEffect } from 'react';
import styles from './CalendarioVisual.module.css';

const CalendarioVisual = ({ onDateSelect, availableDates = [], selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Gera os dias do calendário para o mês atual
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1);
    // Último dia do mês
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const daysArray = [];
    
    // Adiciona dias vazios para completar a primeira semana
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push({ day: null, date: null });
    }
    
    // Adiciona os dias do mês
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Verifica se a data está disponível
      const isAvailable = availableDates.includes(dateString);
      
      // Verifica se é a data selecionada
      const isSelected = selectedDate === dateString;
      
      // Verifica se é um final de semana
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      daysArray.push({
        day,
        date: dateString,
        isAvailable,
        isSelected,
        isWeekend
      });
    }
    
    setCalendarDays(daysArray);
  }, [currentMonth, availableDates, selectedDate]);

  // Navega para o mês anterior
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navega para o próximo mês
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Formata o nome do mês e ano
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Manipula o clique em um dia
  const handleDayClick = (day) => {
    if (day.date && day.isAvailable && !day.isWeekend) {
      onDateSelect(day.date);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button 
          type="button" 
          onClick={prevMonth} 
          className={styles.navButton}
          aria-label="Mês anterior"
        >
          &lt;
        </button>
        <h2 className={styles.monthYear}>{formatMonthYear(currentMonth)}</h2>
        <button 
          type="button" 
          onClick={nextMonth} 
          className={styles.navButton}
          aria-label="Próximo mês"
        >
          &gt;
        </button>
      </div>
      
      <div className={styles.weekdays}>
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>
      
      <div className={styles.days}>
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`
              ${styles.day} 
              ${!day.day ? styles.empty : ''}
              ${day.isWeekend ? styles.weekend : ''}
              ${day.isAvailable ? styles.available : ''}
              ${day.isSelected ? styles.selected : ''}
            `}
            onClick={() => day.day && handleDayClick(day)}
          >
            {day.day}
            {day.isAvailable && <span className={styles.availableDot}></span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioVisual;