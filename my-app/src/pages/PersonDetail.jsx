import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEY, BASE_URL } from "../api";

function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();
        setPerson(data);
      } catch (error) {
        console.error("Lỗi khi fetch chi tiết person:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!person) return <p>Không tìm thấy thông tin.</p>;

  return (
    <div className="person-detail" style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <h2>{person.name}</h2>
      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={person.name}
        style={{ borderRadius: 8, width: 300, height: "450px", objectFit: "cover", }}
        />
        <div>
          <p><strong>Ngày sinh:</strong> {person.birthday || "Không rõ"}</p>
          <p><strong>Ngày mất:</strong> {person.deathday || "—"}</p>
          <p><strong>Nơi sinh:</strong> {person.place_of_birth || "Không rõ"}</p>
          <p style={{ marginTop: "1rem" }}><strong>Tiểu sử:</strong></p>
          <p>{person.biography || "Không có tiểu sử."}</p>
        </div>
      </div>
    </div>
  );
}

export default PersonDetail;
