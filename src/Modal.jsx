const [modalOpen, setModalOpen] = useState(false);

function Modal(){

    // modal 관련 로직
    // modal 창 팝업 시 뒤에 배경 scroll 막기
    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = "hidden";
            // 외부 클릭 감지
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    setModalOpen(false);  // 외부 클릭 시 모달 닫기
                }
            };
            document.addEventListener("mousedown", handleClickOutside); // 외부 클릭 감지

            return () => {
                document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 unmount 시 이벤트 리스너 정리
            };
        } else {
            document.body.style.overflow = "unset";
        }
    }, [modalOpen]);

    // modal 창 닫기
    const closeModal = () => {
        setModalOpen(false);
    };
}

return(
    <Modal isOpen={modalOpen} className="modal-content" overlayClassName="modal-overlay">
    {/* 이어서 작성~~ */}

    </Modal>
)
    


