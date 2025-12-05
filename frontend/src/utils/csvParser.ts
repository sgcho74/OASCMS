import { Unit, UnitStatus } from '@/store/useUnitStore';

export interface CsvImportResult {
    success: boolean;
    data: Omit<Unit, 'id' | 'createdAt'>[];
    errors: string[];
}

export const parseUnitCsv = async (file: File): Promise<CsvImportResult> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                if (!text) {
                    resolve({ success: false, data: [], errors: ['Empty file'] });
                    return;
                }

                const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    resolve({ success: false, data: [], errors: ['File must contain a header row and at least one data row'] });
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const requiredHeaders = ['projectid', 'blockid', 'buildingid', 'unitnumber', 'floor', 'typecode', 'baseprice', 'status'];

                // Basic validation of headers
                const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
                if (missingHeaders.length > 0) {
                    resolve({
                        success: false,
                        data: [],
                        errors: [`Missing required columns: ${missingHeaders.join(', ')}`]
                    });
                    return;
                }

                const data: Omit<Unit, 'id' | 'createdAt'>[] = [];
                const errors: string[] = [];

                // Parse rows
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());

                    if (values.length !== headers.length) {
                        errors.push(`Row ${i + 1}: Column count mismatch`);
                        continue;
                    }

                    const row: any = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index];
                    });

                    // Validate and map types
                    try {
                        const unit: Omit<Unit, 'id' | 'createdAt'> = {
                            projectId: row.projectid,
                            blockId: row.blockid,
                            buildingId: row.buildingid,
                            unitNumber: row.unitnumber,
                            floor: Number(row.floor),
                            typeCode: row.typecode,
                            basePrice: Number(row.baseprice),
                            status: validateStatus(row.status),
                            viewType: row.viewtype || undefined,
                            netAreaSqm: row.netareasqm ? Number(row.netareasqm) : undefined,
                            grossAreaSqm: row.grossareasqm ? Number(row.grossareasqm) : undefined,
                        };

                        if (isNaN(unit.floor)) throw new Error('Invalid Floor');
                        if (isNaN(unit.basePrice)) throw new Error('Invalid Base Price');

                        data.push(unit);
                    } catch (err: any) {
                        errors.push(`Row ${i + 1}: ${err.message}`);
                    }
                }

                resolve({
                    success: errors.length === 0,
                    data: errors.length === 0 ? data : [],
                    errors
                });

            } catch (error: any) {
                resolve({ success: false, data: [], errors: [`File parsing error: ${error.message}`] });
            }
        };

        reader.onerror = () => {
            resolve({ success: false, data: [], errors: ['Failed to read file'] });
        };

        reader.readAsText(file);
    });
};

const validateStatus = (status: string): UnitStatus => {
    const validStatuses: UnitStatus[] = ['Available', 'Reserved', 'Sold', 'OnHold', 'LotteryLocked', 'ContractPending'];
    // Case-insensitive check
    const match = validStatuses.find(s => s.toLowerCase() === status.toLowerCase());
    if (match) return match;
    return 'Available'; // Default
};
