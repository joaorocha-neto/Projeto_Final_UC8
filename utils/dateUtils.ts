export function formatDateTime(utcDateTimeString: string | null): string {
  if (!utcDateTimeString) {
    return "Nunca foi limpa";
  }

  try {
    if (utcDateTimeString === "Invalid Date" || utcDateTimeString === "null" || utcDateTimeString === "") {
      return "Nunca foi limpa";
    }

    let date: Date;
    
    try {
      date = new Date(utcDateTimeString);
      
      if (isNaN(date.getTime())) {
        date = new Date(utcDateTimeString + 'Z');
      }
      
      if (isNaN(date.getTime())) {
        const cleanString = utcDateTimeString.replace(/[^\d\-:T.]/g, '');
        date = new Date(cleanString);
      }
      
      if (isNaN(date.getTime()) && utcDateTimeString.includes('T')) {
        const isoString = utcDateTimeString.replace('T', ' ').split('.')[0];
        date = new Date(isoString + ' UTC');
      }
      
    } catch (parseError) {
      date = new Date(utcDateTimeString);
    }

    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
  } catch (error) {
    return "Data inválida";
  }
}



export function formatDateOnly(dateString: string | null): string {
  if (!dateString) {
    return "Nunca foi limpa";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return "Data inválida";
  }
}

export function formatTimeOnly(dateString: string | null): string {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Hora inválida";
    }
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "Hora inválida";
  }
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) {
    return "Nunca foi limpa";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Agora mesmo";
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return "Ontem";
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch (error) {
    return "Data inválida";
  }
}
