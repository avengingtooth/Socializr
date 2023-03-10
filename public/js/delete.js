/**
 * delete.js
 * Adds a confirmation request when deleting a post
 */

const deleteForm = document.querySelector('.form-delete');

deleteForm.addEventListener('submit', confirmDeletion);

function confirmDeletion(event) {
    if (!confirm('Are you certain that you want to delete this post?')) {
        event.preventDefault();
    }
}