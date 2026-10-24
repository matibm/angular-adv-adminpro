// Socket.IO's Node declarations name this type using modern TypeScript.
// TS 4.0's Map iterator has the same IterableIterator contract at runtime.
// Remove this declaration when the Angular/TypeScript migration is completed.
interface MapIterator<T> extends IterableIterator<T> {}
