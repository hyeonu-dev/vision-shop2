document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  const productIdMatch= path.match(/\/update-product\/(\d+)/);
  const productId = productIdMatch ? productIdMatch[1] : null;
  setMode(productId);

  // 썸네일 이미지 관련 요소들
  const thumbnailUploadArea = document.getElementById('thumbnail-upload-area');
  const thumbnailInput = document.getElementById('thumbnailImage');
  const thumbnailPreview = document.getElementById('thumbnail-preview');
  const thumbnailText = document.getElementById('thumbnail-upload-text');
  const base64ThumbnailInput = document.getElementById('thumbnailImageData'); // 썸네일 base64 input

  // 상세 이미지 관련 요소들
  const detailUploadArea = document.getElementById('detail-upload-area');
  const detailInput = document.getElementById('detailImage');
  const detailPreview = document.getElementById('detail-preview');
  const detailText = document.getElementById('detail-upload-text');
  const base64DetailInput = document.getElementById('detailImageData'); // 상세 이미지 base64 input

  // 썸네일 이미지 업로드 설정
  if (thumbnailUploadArea && thumbnailInput && thumbnailPreview && thumbnailText) {
    setupImageUpload(
        thumbnailUploadArea,
        thumbnailInput,
        thumbnailPreview,
        thumbnailText,
        base64ThumbnailInput // 썸네일의 base64 값을 저장할 hidden input
    );
  } else {
    console.warn('썸네일 업로드 관련 요소가 없습니다.');
  }

  // 상세 이미지 업로드 설정
  if (detailUploadArea && detailInput && detailPreview && detailText) {
    setupImageUpload(
        detailUploadArea,
        detailInput,
        detailPreview,
        detailText,
        base64DetailInput // 상세 이미지의 base64 값을 저장할 hidden input
    );
  } else {
    console.warn('상세 이미지 업로드 관련 요소가 없습니다.');
  }

  const unitPriceInput = document.getElementById("unitPrice");
  const discountPriceInput = document.getElementById("discountPrice");
  const sellingPriceInput = document.getElementById("sellingPrice");
  const purchasePriceInput = document.getElementById("purchasePrice");

  function calculateSellingPrice() {
    const purchasePrice = parseFloat(purchasePriceInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const discountPrice = parseFloat(discountPriceInput.value) || 0;

    let sellingPrice = unitPrice - discountPrice;
    sellingPriceInput.value = sellingPrice || 0;
  }

  purchasePriceInput.addEventListener("input", calculateSellingPrice);
  unitPriceInput.addEventListener("input", calculateSellingPrice);
  discountPriceInput.addEventListener("input", calculateSellingPrice);

  function setDefaultValue(inputElement) {
    let value = inputElement.value;
    value = parseFloat(value.replace(/[^0-9]/g, ""));
    if (!value) value = 0;
    inputElement.value = value;
  }

  purchasePriceInput.addEventListener("input", () => setDefaultValue(purchasePriceInput));
  unitPriceInput.addEventListener("input", () => setDefaultValue(unitPriceInput));
  discountPriceInput.addEventListener("input", () => setDefaultValue(discountPriceInput));
  sellingPriceInput.addEventListener("input", () => setDefaultValue(sellingPriceInput)); // 판매가는 readonly이므로 변경 불가

  const categorySelect = document.getElementById('categoryId');
  updateCategoryColor(categorySelect);
  categorySelect.addEventListener('change', (event) => updateCategoryColor(event.target));
});

/**
 * 선택된 카테고리에 따라 색상 클래스를 변경하는 함수
 * @param {HTMLSelectElement} selectElement - 카테고리 선택 `select` 요소
 */
function updateCategoryColor(selectElement) {
  if (!selectElement.value) {
    selectElement.classList.add('color-gray');
    selectElement.classList.remove('color-black');
  } else {
    selectElement.classList.add('color-black');
    selectElement.classList.remove('color-gray');
  }
}

/**
 * mode에 따른 타이틀, form 경로 메핑
 * @param {bigint} productId - productId, 수정시에만 존재
 */
function setMode(productId) {
  if (productId) {
    const title = document.getElementById('main-title');
    const form = document.getElementById('product-form');
    const input = document.getElementById('id');
    title.innerText = '상품 수정';
    form.action = '/products/update-product/' + productId;
    input.value = productId;
  }
}

/**
 * 이미지 업로드 영역 초기화
 * @param {HTMLElement} uploadArea - 업로드 영역 요소
 * @param {HTMLInputElement} input - 파일 입력 요소
 * @param {HTMLImageElement} preview - 이미지 미리보기 요소
 * @param {HTMLElement} text - 업로드 텍스트 요소
 * @param {HTMLInputElement} base64Input - base64 데이터를 담을 숨겨진 input 요소
 */
function setupImageUpload(uploadArea, input, preview, text, base64Input) {
  // 파일 선택 클릭 처리
  uploadArea.addEventListener('click', () => input.click());

  // 파일 선택 후 미리보기 처리
  input.addEventListener('change', (event) =>
      handleFileSelect(event, preview, text, base64Input)
  );

  // 드래그 앤 드롭 처리
  setupDragAndDrop(uploadArea, (file) =>
      handleFilePreview(file, preview, text, base64Input)
  );
}

/**
 * 파일 선택 후 미리보기 처리
 * @param {Event} event - 파일 선택 이벤트
 * @param {HTMLImageElement} previewElement - 이미지 미리보기 요소
 * @param {HTMLElement} textElement - 업로드 텍스트 요소
 * @param {HTMLInputElement} base64Input - base64 데이터를 담을 숨겨진 input 요소
 */
function handleFileSelect(event, previewElement, textElement, base64Input) {
  const files = event.target.files;
  if(files.length === 0) return;

  if (files[0] && files[0].type.startsWith('image/')) {
    handleFilePreview(files[0], previewElement, textElement, base64Input);
  } else {
    alert('이미지 파일만 선택 가능합니다.');
  }
}

/**
 * 파일을 미리보기로 표시하고 base64로 변환하여 hidden input에 할당
 * @param {File} file - 선택된 파일
 * @param {HTMLImageElement} previewElement - 이미지 미리보기 요소
 * @param {HTMLElement} textElement - 업로드 텍스트 요소
 * @param {HTMLInputElement} base64Input - base64 데이터를 담을 숨겨진 input 요소
 */
function handleFilePreview(file, previewElement, textElement, base64Input) {
  const reader = new FileReader();
  reader.onload = (e) => {
    // base64 값 얻기
    const base64String = e.target.result;

    // base64로 변환된 값 hidden input에 할당
    base64Input.value = base64String;

    // 미리보기 표시
    previewElement.src = base64String;
    previewElement.classList.remove('hidden'); // 미리보기 표시
    textElement.classList.add('hidden'); // "사진 첨부하기" 텍스트 숨기기
  };

  // 파일을 base64로 읽기
  reader.readAsDataURL(file);
}

/**
 * 드래그 앤 드롭 영역 설정
 * @param {HTMLElement} uploadArea - 업로드 영역 요소
 * @param {Function} onFileDrop - 파일 드롭 처리 함수
 */
function setupDragAndDrop(uploadArea, onFileDrop) {
  uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('bg-orange-100'); // 드래그 오버 시 배경 색상 변경
  });

  uploadArea.addEventListener('dragleave', () =>
      uploadArea.classList.remove('bg-orange-100')
  );

  uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('bg-orange-100');
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileDrop(file);
    } else {
      alert('이미지 파일만 선택 가능합니다.');
    }
  });
}

