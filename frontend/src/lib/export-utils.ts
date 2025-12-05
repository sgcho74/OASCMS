// Export utilities for data backup and migration

export function downloadJSON(data: any, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function downloadCSV(data: any[], filename: string, columns: string[]) {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    // Create CSV header
    const header = columns.join(',');

    // Create CSV rows
    const rows = data.map(item =>
        columns.map(col => {
            const value = item[col];
            // Handle strings with commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
        }).join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function generateFullBackup() {
    const backup: Record<string, any> = {};

    // Get all localStorage keys related to our app
    const storageKeys = [
        'oascms-projects',
        'oascms-blocks',
        'oascms-buildings',
        'oascms-units',
        'lead-storage',
        'reservation-storage',
        'oascms-contracts',
        'payment-storage',
        'lottery-storage',
        'theme-storage'
    ];

    storageKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                backup[key] = JSON.parse(data);
            } catch (e) {
                backup[key] = data;
            }
        }
    });

    backup.exportDate = new Date().toISOString();
    backup.version = '1.0';

    downloadJSON(backup, 'oascms_full_backup');
}

export async function parseFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;

                if (file.name.endsWith('.json')) {
                    resolve(JSON.parse(content));
                } else if (file.name.endsWith('.csv')) {
                    // Simple CSV parser
                    const lines = content.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',');
                    const data = lines.slice(1).map(line => {
                        const values = line.split(',');
                        const obj: any = {};
                        headers.forEach((header, i) => {
                            obj[header.trim()] = values[i]?.trim();
                        });
                        return obj;
                    });
                    resolve(data);
                } else {
                    reject(new Error('Unsupported file format'));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

export function restoreFullBackup(backup: any) {
    if (!backup.version || !backup.exportDate) {
        throw new Error('Invalid backup file');
    }

    const storageKeys = Object.keys(backup).filter(k => k !== 'version' && k !== 'exportDate');

    storageKeys.forEach(key => {
        const value = typeof backup[key] === 'string' ? backup[key] : JSON.stringify(backup[key]);
        localStorage.setItem(key, value);
    });

    return storageKeys.length;
}
