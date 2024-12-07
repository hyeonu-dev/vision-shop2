document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const menuLink = item; // item 자체가 <a> 태그입니다.
        const menuIcon = menuLink.querySelector('img'); // <a> 태그 안의 <img> 태그를 찾습니다.

        if (currentPath.includes(menuLink.getAttribute('href'))) {
            item.classList.add('active');
            menuIcon.classList.add('selected');
        } else {
            item.classList.remove('active');
            menuIcon.classList.remove('selected');
        }
    });

    /* 사이드바 동적 높이 설정 */
    syncHeights();
    window.addEventListener("resize", syncHeights);
});

function syncHeights() {
    const sidebar = document.querySelector(".sidebar-fragment");
    const content = document.getElementsByTagName("section");

    if (content && content[0] && sidebar) {
        const contentHeight = content[0].scrollHeight+160;
        const windowHeight = window.innerHeight;
        sidebar.style.height = `${Math.max(contentHeight, windowHeight)}px`;
    }
}

