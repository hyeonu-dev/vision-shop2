document.addEventListener('DOMContentLoaded', function () {

  /*
  * 카테고리 생성 및 수정 관련
   */
  document.getElementById('create-category').addEventListener('click', function () {
    openModal('/categories/new-category');
  });

  document.querySelectorAll('#btn-edit').forEach(button => {
    button.addEventListener('click', function () {
      const categoryId = this.getAttribute('data'); // 버튼의 데이터 속성
      openModal(`/categories/update-category/${categoryId}`);
    });
  });

  /*
  * 카테고리 삭제 관련
  * */
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-delete')) {
      const categoryId = event.target.getAttribute('data');
      if (confirm('해당 카테고리를 정말 삭제하시겠습니까?')) {
        deleteCategory(categoryId);
      }
    }
  });
});

/**
 * 카테고리 삭제 처리
 * @param {bigint} categoryId - 삭제할 카테고리 ID
 */
function deleteCategory(categoryId) {
  fetch(`/api/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            alert('카테고리 삭제 중 오류가 발생했습니다. \n' + error.message);
          });
        }
        location.reload();
      })
      .catch(error => {
        console.error(error);
      });
}


/**
 * 모달 열기 함수
 * @param {string} url - 요청할 URL
 */
function openModal(url) {
  fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load modal content');
        return response.text();
      })
      .then(html => {
        const modalArea = document.getElementById('modal-area');
        modalArea.innerHTML = html; // HTML 삽입

        const commonModal = document.getElementById('modal-container');
        if (commonModal) commonModal.classList.remove('hidden');

        document.getElementById('btn-close').addEventListener('click', () => {
          modalArea.innerHTML = ''; // 팝업 제거
        });

        document.getElementById('category-form').addEventListener('submit', function (e) {
          e.preventDefault();  // 기본 폼 제출 방지
          submitForm(this, url); // submitForm 호출
        });
      })
      .catch(error => console.error(error));
}

/**
 * 폼 제출 함수
 * @param {HTMLFormElement} form - 제출할 폼 요소
 * @param {string} url - 제출할 폼 url
 */
function submitForm(form, url) {

  const formData = new FormData(form);
  fetch(url, {
    method: 'POST',
    body: formData,
    redirect: 'follow'
  })
      .then(response => {
        if(response.ok) {
          window.location.href = "/categories";
        }
        return response.json();
      })
      .then(data => {
        const errorMessage = data.message || '알 수 없는 오류가 발생했습니다.';
        document.querySelector('#category-name-error').textContent = errorMessage;
        document.querySelector('#category-name-error').classList.remove('hidden');
      })
      .catch(error => {
        console.error('폼 제출 처리 중 오류 발생: ', error);
      });

}
