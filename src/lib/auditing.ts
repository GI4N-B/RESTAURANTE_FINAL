import { createClient } from '@/lib/supabase/server';

export interface AuditLog {
  id?: string;
  entity_type: 'user' | 'inventory' | 'order' | 'product';
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'suspend' | 'restore';
  changed_fields?: Record<string, { old: any; new: any }>;
  actor_id?: string;
  timestamp?: string;
  details?: Record<string, any>;
}

export async function logAudit(audit: AuditLog) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('audit_logs').insert({
      entity_type: audit.entity_type,
      entity_id: audit.entity_id,
      action: audit.action,
      changed_fields: audit.changed_fields,
      actor_id: audit.actor_id || user?.id,
      details: audit.details,
      timestamp: new Date().toISOString(),
    });

    if (error) console.error('Error logging audit:', error);
  } catch (error) {
    console.error('Error in logAudit:', error);
  }
}

export function getDifferenceObject(
  before: Record<string, any>,
  after: Record<string, any>
): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {};

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes[key] = {
        old: before[key],
        new: after[key],
      };
    }
  }

  return changes;
}
