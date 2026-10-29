'use server';

export async function someWriteAction(recordId: string) {
  const session = { userId: 'usr_123', role: 'user' };
  
  if (!session || !session.userId) {
    throw new Error('Access Denied: Unauthenticated write attempt blocked.');
  }

  if (recordId !== 'usr_123') {
    throw new Error('Security Violation: Attempted write to unauthorized record ID.');
  }

  return { success: true, message: 'Mutation executed successfully.' };
}