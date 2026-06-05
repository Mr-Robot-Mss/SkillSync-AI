const STORAGE_KEY = "skillsync_saved_jobs";

export function getSavedJobs() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function isJobSaved(jobId) {
  return getSavedJobs().some((job) => job.id === jobId);
}

export function saveJob(job) {
  const savedJobs = getSavedJobs();

  if (savedJobs.some((item) => item.id === job.id)) {
    return savedJobs;
  }

  const updatedJobs = [...savedJobs, job];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));

  return updatedJobs;
}

export function removeSavedJob(jobId) {
  const updatedJobs = getSavedJobs().filter((job) => job.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));

  return updatedJobs;
}

export function toggleSavedJob(job) {
  if (isJobSaved(job.id)) {
    return removeSavedJob(job.id);
  }

  return saveJob(job);
}